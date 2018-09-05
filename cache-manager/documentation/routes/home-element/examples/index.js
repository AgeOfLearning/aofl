context.cacheManager = new CacheManager('cacheManagerExample', cacheTypeEnumerate.Memory);
context.data = context.cacheManager.getCollection();

context.submitted = (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  context.cacheManager.setItem(formData.get('key'), formData.get('value'));
  context.data = context.cacheManager.getCollection();
};
