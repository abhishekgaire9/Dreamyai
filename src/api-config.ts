interface ApiConfig {
    openaiKey: string | null;
    groqKey: string | null;
  }
  
  const isConfigured = (key: string | null): boolean => {
    return !!key && key.length > 0;
  };
  
  export const checkApiConfig = (): ApiConfig => {
    return {
      openaiKey: null, // Will be replaced with actual key later
      groqKey: null, // Will be replaced with actual key later
    };
  };
  
  export const isOpenAIConfigured = (): boolean => {
    return isConfigured(checkApiConfig().openaiKey);
  };
  
  export const isGroqConfigured = (): boolean => {
    return isConfigured(checkApiConfig().groqKey);
  };
  