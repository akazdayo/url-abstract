import { createSignal } from "solid-js";

export default function GeminiRequest() {
	const [response, setResponse] = createSignal("");
	const [loading, setLoading] = createSignal(false);

	const handleSubmit = async (event: Event) => {
		event.preventDefault();
		const apiKey = localStorage.getItem("geminiApiKey");
		if (!apiKey) {
			alert("Please set your Gemini API key in the settings.");
			return;
		}
		
		// Debug: Log API key format (first 10 chars only for security)
		console.log("API Key format:", apiKey.substring(0, 10) + "...");

		const formData = new FormData(event.target as HTMLFormElement);
		const url = formData.get("url") as string;

		if (!url) {
			alert("Please enter a URL.");
			return;
		}

		setLoading(true);
		setResponse("");

		try {
			// First, fetch the content from the URL via our API
			const contentResponse = await fetch('/api/summarize', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ url }),
			});

			if (!contentResponse.ok) {
				const errorData = await contentResponse.json();
				throw new Error(errorData.error || `Failed to fetch URL content: ${contentResponse.status}`);
			}

			const { content } = await contentResponse.json();
			
			// Then send the content to Gemini for summarization (client-side)
			const geminiResponse = await fetch(
				`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						contents: [
							{
								parts: [
									{
										text: `Please summarize the following web content in Japanese. Provide a concise summary focusing on the main points:\n\n${content}`,
									},
								],
							},
						],
						generationConfig: {
							temperature: 0.7,
							topK: 1,
							topP: 1,
							maxOutputTokens: 2048,
						},
					}),
				},
			);

			if (!geminiResponse.ok) {
				const errorText = await geminiResponse.text();
				throw new Error(`Gemini API error: ${geminiResponse.status} - ${errorText}`);
			}

			const geminiData = await geminiResponse.json();

			if (geminiData.candidates?.[0]?.content) {
				setResponse(geminiData.candidates[0].content.parts[0].text);
			} else {
				setResponse("Error: No response from Gemini API");
			}
		} catch (error) {
			console.error("Error calling Gemini API:", error);
			setResponse(
				`Error: ${error instanceof Error ? error.message : "Unknown error"}`,
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div class="max-w-2xl mx-auto p-6">
			<form onSubmit={handleSubmit} class="space-y-4">
				<div>
					<label for="url" class="block text-sm font-medium text-gray-700">
						URL
					</label>
					<input
						type="url"
						id="url"
						name="url"
						required
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
						placeholder="Enter URL to summarize"
					/>
				</div>
				<button
					type="submit"
					disabled={loading()}
					class="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
				>
					{loading() ? "Summarizing..." : "Summarize"}
				</button>
			</form>

			{response() && (
				<div class="mt-6 p-4 bg-gray-50 rounded-md">
					<h3 class="text-lg font-medium text-gray-900 mb-2">Summary:</h3>
					<p class="text-gray-700 whitespace-pre-wrap">{response()}</p>
				</div>
			)}
		</div>
	);
}
