export const isValidUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  
  try {
    const urlObj = new URL(url);
    const isValidProtocol = urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    const isValidLength = url.length <= 2048;
    return isValidProtocol && isValidLength;
  } catch {
    return false;
  }
};

export const validateUrls = (urls, maxCount = 20) => {
  if (!urls || urls.length === 0) return { valid: true };
  
  if (urls.length > maxCount) {
    return { valid: false, error: `Maximum ${maxCount} URLs allowed per request` };
  }
  
  for (const url of urls) {
    if (!isValidUrl(url)) {
      return { valid: false, error: `Invalid URL: ${url}` };
    }
  }
  
  return { valid: true };
};

export const validateProduct = (data) => {
  if (!data.name || typeof data.name !== 'string' || data.name.trim() === '') {
    return { valid: false, error: 'name is required and must be non-empty string' };
  }
  
  if (!data.sku || typeof data.sku !== 'string' || data.sku.trim() === '') {
    return { valid: false, error: 'sku is required and must be non-empty string' };
  }
  
  return { valid: true };
};

export const validateMediaAddition = (image_urls, video_urls) => {
  if ((!image_urls || image_urls.length === 0) && (!video_urls || video_urls.length === 0)) {
    return { valid: false, error: 'At least one of image_urls or video_urls must be provided' };
  }
  return { valid: true };
};