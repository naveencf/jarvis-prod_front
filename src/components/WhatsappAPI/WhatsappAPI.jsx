import axios from "axios";

const WhatsappAPI = () => {
  const callWhatsAPI = async (
    campaignName,
    destination,
    userName,
    templateParams
  ) => {
    try {
      const response = await axios.post(
        "https://backend.api-wa.co/campaign/heyx/api",
        {
          apiKey:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0ODA0YmMyYTVjOTlmMGYwNmY3Y2QyNSIsIm5hbWUiOiJDcmVhdGl2ZWZ1ZWwiLCJhcHBOYW1lIjoiQWlTZW5zeSIsImNsaWVudElkIjoiNjQ4MDRiYzJkYzhjZWYwNDViOTY3NTk2IiwiYWN0aXZlUGxhbiI6IkJBU0lDX01PTlRITFkiLCJpYXQiOjE2OTc0NDQ3OTB9.xg686Rd8V4J1PzDA27P1KBho1MTnYwo3X_WB0o0-6qs",
          campaignName: campaignName,
          destination: destination,
          userName: userName,
          templateParams: templateParams,
        }
      );

      if (response.status === 200) {
        console.log("API response", response.data);
      } else {
        console.error("API request failed with status", response.status);
      }
    } catch (error) {
      console.error("API error", error);
    }
  };

  return { callWhatsAPI };
};

export default WhatsappAPI;
