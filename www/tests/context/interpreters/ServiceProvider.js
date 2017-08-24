define([
    'underscore',
    '../ContextTestHelper',
    'pmodules/context/interpreters/ServiceProviderInterpreter'
], function(_, tester, ServiceProviderInterpreter) {

    describe("ServiceProviderInterpreter", function() {

        beforeEach(function () {
            tester.prepareInterpreterTest({
                sut: ServiceProviderInterpreter,
                inList: [
                    {accounts: "CI_REGISTERED_ACCOUNTS"}
                ],
                outList: [
                    {providers: "CI_SERVICE_PROVIDER"}
                ]
            }, this);
        });

        it("should give unknown value if accounts are unknown", function (done) {
            this.accounts.setValueUnknown();

            this.sut._interpretData(this.inList, this.outList, _.bind(function () {
                expect(this.providers.isKnown()).toBe(false);
                done();
            }, this));
        });

        it("should find email addresses", function (done) {
            var email = {
                provider: "email",
                account: "anonym@test.de"
            };

            this.accounts.setValue([
                {type: "com.microsoft.office", name: "Office"},
                {type: "com.dropbox.android.account", name: "anonym@test.de"}
            ]);

            this.sut._interpretData(this.inList, this.outList, _.bind(function () {
                expect(JSON.stringify(this.providers.getValue())).toBe(JSON.stringify([email]));
                done();
            }, this));
        });

        it("should find facebook id", function (done) {
            var facebook = {
                provider: "facebook",
                account: "123456789"
            };

            this.accounts.setValue([
                {type: "com.microsoft.office", name: "Office"},
                {type: "com.facebook.auth.login", name: "123456789"}
            ]);

            this.sut._interpretData(this.inList, this.outList, _.bind(function () {
                expect(JSON.stringify(this.providers.getValue())).toBe(JSON.stringify([facebook]));
                done();
            }, this));
        });

        it("should find twitter handle", function (done) {
            var twitter = {
                provider: "twitter",
                account: "myTwitterName"
            };

            this.accounts.setValue([
                {type: "com.microsoft.office", name: "Office"},
                {type: "com.twitter.android.auth.login", name: "myTwitterName"}
            ]);

            this.sut._interpretData(this.inList, this.outList, _.bind(function () {
                expect(JSON.stringify(this.providers.getValue())).toBe(JSON.stringify([twitter]));
                done();
            }, this));
        });

        it("should find threema handle", function (done) {
            var threema = {
                provider: "threema",
                account: "ABC123"
            };

            this.accounts.setValue([
                {type: "com.microsoft.office", name: "Office"},
                {type: "ch.threema.app", name: "ABC123"}
            ]);

            this.sut._interpretData(this.inList, this.outList, _.bind(function () {
                expect(JSON.stringify(this.providers.getValue())).toBe(JSON.stringify([threema]));
                done();
            }, this));
        });

    });

});
