// 定義存儲的數據類型
interface StorageData<T> {
  data: T;
}

// 將數據存儲到本地存儲中
export function setLocal<T>(key: string, value: T): boolean {
  try {
    const data: StorageData<T> = { data: value };
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('LocalStorage setItem error:', error);
    return false;
  }
}

// 從本地存儲中獲取數據
export function getLocal<T>(key: string): T | null {
  try {
    const data = localStorage.getItem(key);
    if (data) {
      const parsedData: StorageData<T> = JSON.parse(data);
      return parsedData.data;
    }
    return null;
  } catch (error) {
    console.error('LocalStorage getItem error:', error);
    return null;
  }
}

// 從本地存儲中刪除數據
export function removeLocal(key: string): boolean {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('LocalStorage removeItem error:', error);
    return false;
  }
}

// 清空本地存儲中的所有數據
export function clearLocal(): boolean {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('LocalStorage clear error:', error);
    return false;
  }
}
