import { createSignal, onMount } from 'solid-js';
import { ApiKeyModal } from './ApiKeyModal';

export const ApiKeyChecker = () => {
  const [isModalOpen, setIsModalOpen] = createSignal(false);

  onMount(() => {
    if (typeof window !== 'undefined') {
      const savedApiKey = localStorage.getItem('geminiApiKey');
      
      if (!savedApiKey) {
        // API Keyが設定されていない場合、少し遅延してモーダルを表示
        setTimeout(() => {
          setIsModalOpen(true);
        }, 500);
      } else {
        // API Keyが設定されている場合、メインフォームに値を設定
        const mainApiKeyInput = document.getElementById('apiKey') as HTMLInputElement;
        if (mainApiKeyInput) {
          mainApiKeyInput.value = savedApiKey;
        }
      }
    }
  });

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <ApiKeyModal 
      isOpen={isModalOpen()} 
      onClose={handleCloseModal}
    />
  );
};