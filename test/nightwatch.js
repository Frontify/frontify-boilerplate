module.exports = {
  "Test Application" : function (browser) {
    browser
      .url("http://localhost:3000")
      .waitForElementVisible('body', 1000)
      .assert.title('Home')
      .waitForElementVisible('.mod-navigation', 1000)
      .waitForElementVisible('.mod-navigation .item:nth-of-type(2)', 1000)
      .click('.mod-navigation .item:nth-of-type(2) a')
      .assert.title('Users')
      .waitForElementVisible('.mod-article', 1000)
      .assert.containsText('.mod-article', 'User Content')
      .click('.mod-navigation .item:nth-of-type(1) a')
      .assert.title('Home')
      .waitForElementVisible('.mod-article', 1000)
      .assert.containsText('.mod-article', 'Home Content')
      .end();
  }
};