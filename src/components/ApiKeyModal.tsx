import { createSignal, onMount, Show } from 'solid-js';

export interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiKeyModal = (props: ApiKeyModalProps) => {
  const [apiKey, setApiKey] = createSignal('');

  onMount(() => {
    if (typeof window !== 'undefined') {
      const savedApiKey = localStorage.getItem('geminiApiKey');
      if (savedApiKey) {
        setApiKey(savedApiKey);
      }
    }
  });

  const handleSave = (e: Event) => {
    e.preventDefault();
    if (apiKey() && typeof window !== 'undefined') {
      localStorage.setItem('geminiApiKey', apiKey());
      
      // メインフォームのAPI Key入力欄にも値を設定
      const mainApiKeyInput = document.getElementById('apiKey') as HTMLInputElement;
      if (mainApiKeyInput) {
        mainApiKeyInput.value = apiKey();
      }
      
      props.onClose();
    }
  };

  const handleCancel = () => {
    props.onClose();
  };

  const handleBackdropClick = (e: Event) => {
    if (e.target === e.currentTarget) {
      props.onClose();
    }
  };

  return (
    <Show when={props.isOpen}>
      <div 
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={handleBackdropClick}
      >
        <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold text-gray-900">API Key設定</h2>
            <button 
              onClick={handleCancel}
              class="text-gray-400 hover:text-gray-600"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <div class="mb-4">
            <p class="text-gray-600 mb-2">Gemini API Keyが設定されていません。</p>
            <p class="text-sm text-gray-500">API Keyを設定してURL要約機能を使用してください。</p>
          </div>
          
          <form onSubmit={handleSave}>
            <div class="mb-4">
              <label for="modalApiKey" class="block text-sm font-medium text-gray-700 mb-2">
                Gemini API Key
              </label>
              <input 
                type="password" 
                id="modalApiKey" 
                placeholder="API Key"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={apiKey()}
                onInput={(e) => setApiKey(e.currentTarget.value)}
                required
              />
            </div>
            
            <div class="flex justify-end space-x-3">
              <button 
                type="button" 
                onClick={handleCancel}
                class="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                キャンセル
              </button>
              <button 
                type="submit"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                保存
              </button>
            </div>
          </form>
        </div>
      </div>
    </Show>
  );
};