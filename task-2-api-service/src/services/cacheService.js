class CacheService{
  constructor(){
    this.cache = new Map();
    this.defaultTTL = 3600;
  }
  async get(key){
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt){
      this.cache.delete(key);
      return null;
    }
    return entry.value;
  }
  async set(key, value, ttl = this.defaultTTL){
    this.cache.set(key, {
      value,
      expiresAt: Date.now() + (ttl*1000)
    });
    return true;
  }
  async delete(key) {
    return this.cache.delete(key);
  }
  async clear() {
    this.cache.clear();
    return true;
  }
}
export const cache = new CacheService();