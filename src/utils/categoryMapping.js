// Category name mapping for URL generation
export const getCategoryUrlName = (categoryName) => {
  const categoryMapping = {
    // English names
    "car": "cars",
    "cars": "cars",
    "house": "houses", 
    "houses": "houses",
    "land": "lands",
    "lands": "lands",
    "motorcycle": "motorcycles",
    "motorcycles": "motorcycles",
    "marine": "marines",
    "marines": "marines",
    
    // Arabic names (singular)
    "سيارة": "cars",
    "منزل": "houses",
    "أرض": "lands",
    "دراجة نارية": "motorcycles",
    "مركبة بحرية": "marines",
    
    // Arabic names (plural)
    "سيارات": "cars",
    "منازل": "houses",
    "أراضي": "lands",
    "دراجات نارية": "motorcycles",
    "مركبات بحرية": "marines"
  };
  
  return categoryMapping[categoryName] || categoryName;
};

// Reverse mapping for route validation
export const getValidCategoryNames = () => {
  return ["lands", "houses", "cars", "motorcycles", "marines"];
};
