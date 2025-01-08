export const parseRange = (range) => {
  if (range === 'lessThan10K') {
    return { min: 0, max: 10000 };
  }
  const [min, max] = range.split('to').map((val) => parseInt(val.replace('K', '')) * 1000);
  return { min, max };
};
export const getPriceDetail = (priceDetails, key) => {
  const detail = priceDetails?.find((item) => item[key] !== undefined);
  return detail ? detail[key] : 0;
};

export const ButtonTitle = ['Other Inventory', 'Sarcasm Network', 'Own-Pages', 'Advanced-Pages', 'Recently Used Top Pages', 'All Inventory', 'Handi-Picked Pages', ''];

export const calculatePrice = (rate_type, pageData, type) => {
  const getPriceDetail = (priceDetails, key) => {
    const detail = priceDetails?.find((item) => item[key] !== undefined);
    return detail ? detail[key] : 0;
  };

  if (rate_type === 'Variable') {
    const followersCountInMillions = pageData.followers_count / 1000000;

    if (type === 'post') {
      const postPrice = followersCountInMillions * getPriceDetail(pageData.page_price_list, 'instagram_post');
      return postPrice;
    } else if (type === 'story') {
      const storyPrice = followersCountInMillions * getPriceDetail(pageData.page_price_list, 'instagram_story');
      return storyPrice;
    } else {
      const bothPrice = followersCountInMillions * getPriceDetail(pageData.page_price_list, 'instagram_both');
      return bothPrice;
    }
  }

  return 0; // Default return value if rate_type is not 'Variable'
};

// export const parseRange = (range) => {
//   if (range === 'lessThan10K') {
//     return { min: 0, max: 10000 };
//   } else if (range === '1000KPlus') {
//     return { min: 1000000, max: Infinity };
//   } else if (range === '2000KPlus') {
//     return { min: 2000000, max: Infinity };
//   }

//   const [min, max] = range.split('to').map((val) => {
//     const value = parseInt(val.replace('K', '')) * 1000;
//     return value;
//   });
//   return { min, max };
// };
