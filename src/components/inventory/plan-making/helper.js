export const parseRange = (range) => {
  if (range === 'lessThan10K') {
    return { min: 0, max: 10000 };
  }
  const [min, max] = range
    .split('to')
    .map((val) => parseInt(val.replace('K', '')) * 1000);
  return { min, max };
};
export const getPriceDetail = (priceDetails, key) => {
  const detail = priceDetails?.find((item) => item[key] !== undefined);
  return detail ? detail[key] : 0;
};

export const ButtonTitle = [
  'Other Inventory',
  'Sarcasm Network',
  'Own-Pages',
  'Advanced-Pages',
  'Recently Used Top Pages',
  'All Inventory',
  '',
];

export const calculatePrice = (rate_type, pageData, type) => {
  if (rate_type === 'Variable') {
    // Calculate for post price (followers_count / 10,000) * m_post_price
    if (type === 'post') {
      const postPrice =
        (pageData.followers_count / 1000000) * pageData.m_post_price;
      return postPrice;
    } else if (type === 'story') {
      const storyPrice =
        (pageData.followers_count / 1000000) * pageData.m_story_price;
      return storyPrice;
    } else {
      const bothPrice =
        (pageData.followers_count / 1000000) * pageData.m_both_price;
      return bothPrice;
    }
  }
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
