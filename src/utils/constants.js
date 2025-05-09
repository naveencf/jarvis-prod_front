import { baseUrl } from "./config";

export const constant = Object.freeze({
  CONST_USER_ROLE: 4,
  CONST_SALES_DEPT_ID: 36,
  CONST_MANAGER_ROLE: 2,
  CONST_HR_ROLE: 5,
  CONST_ADMIN_ROLE: 1,
  CONST_SUPER_ADMIN_ROLE:6,  CONST_SARCASM_BLOG_CATEGORY: `${baseUrl}v1/sarcasm/blog-category`,
  CONST_SARCASM_BLOG_POST: `${baseUrl}v1/sarcasm/blog/`,
  CONST_SARCASM_IMAGE_UPLOAD: `${baseUrl}v1/sarcasm/gcp/upload-image`,
  GOOGLE_CLIENT_ID_FOR_LOGIN: "366101467041-oo2gsrro5kule07nso3jhfngk09vh4ho.apps.googleusercontent.com",
});
// 
//admin = 1 , manager = 2 , office boy = 3 , user = 4 , hr = 5 these are role id
