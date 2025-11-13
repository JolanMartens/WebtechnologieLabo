silktideCookieBannerManager.updateCookieBannerConfig({
  background: { showBackground: true },
  cookieIcon: { position: "bottomLeft" },
  cookieTypes: [],
  text: {
    banner: {
      description: "<p>We use cookies on our site. <a href='/cookie-policy' target='_blank'>Cookie Policy</a></p>",
      acceptAllButtonText: "Accept all",
      rejectNonEssentialButtonText: "Reject non-essential",
      preferencesButtonText: "Preferences"
    },
    preferences: {
      title: "Customize your cookie preferences",
      description: "<p>We respect your right to privacy. You can choose not to allow some types of cookies.</p>"
    }
  },
  position: { banner: "center" }
});
