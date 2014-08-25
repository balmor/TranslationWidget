describe("Translation fields widget", function() {

    beforeEach(function(){
        $container = $('<div class="control-group"><label class="control-label">Translation</label><div class="controls"></div></div>').appendTo('form');
        $base = $('<input type="text" class="m-wrap lang-translation" name="test" disabled />').appendTo($container.children(".controls"));
        $wi = $base.translationFields();
    });

    afterEach(function() {
        // $container.html("");
    });

    describe("created html structure", function() {

        it("should have a wraper div around", function() {
            var parent = $base.parent('.input-prepend');
            expect(parent).toExist();
        });

        it("should have a button to open translation", function() {
            var parent = $base.prev('.open-translation');
            expect(parent).toExist();
        });
    });

    describe("open translation button", function() {

        it("should make popup visible", function() {
            var openTranslation = $base.prev('.open-translation').trigger("click");
            expect(openTranslation).toHaveClass("open");
            expect(openTranslation.parent()).toHaveClass("show");
        });
    });

    describe("body on click when translation popup is showed", function() {

        it("should hide it", function() {
            var openTranslation = $base.prev('.open-translation').trigger("click");
            $("body").trigger("click");
            console.log($base.parent());
            expect($base.parent()).not.toHaveClass("show");
        });
    });

    describe("the apply button", function() {

        it("after click should add new badge", function() {
            var openTranslation = $base.prev('.open-translation').trigger("click");

            // add polish translation
            $base.parent().find(".select-language").val("PL").change(); //select PL
            $base.parent().find(".m-wrap.new-word").val("Tekst po polsku"); // add translation
            $base.parent().find(".apply").trigger("click"); // click the button

            var languageTabsContainer = $base.parent().find(".language-tabs");
            expect(languageTabsContainer).toContain('span#PL>input[value="Tekst po polsku"]');
        });
    });

    describe("the remove badge button", function() {

        it("after click should remove it", function() {
            var openTranslation = $base.prev('.open-translation').trigger("click");
            var languageTabsContainer = $base.parent().find(".language-tabs");

            // add polish translation
            
            runs(function () {
                $base.parent().find(".select-language").val("PL").change(); //select PL
                $base.parent().find(".m-wrap.new-word").val("Tekst po polsku"); // add translation
                $base.parent().find(".apply").trigger("click"); // click the button

                $base.parent().find("#PL .remove").trigger("click"); // click remove button
                $("body").find("#removeYes").trigger("click"); // confirm
            });

            waits(700); // because fadeout of removed label equal 400 and for sure we should wait more time for execute test
            expect(languageTabsContainer).toBeEmpty();
        });
    });

    describe("User can change translation.", function() {

        it("Should update translation", function() {
            var openTranslation = $base.prev('.open-translation').trigger("click");

            // add polish translation
            $base.parent().find(".select-language").val("PL").change(); //select PL
            $base.parent().find(".m-wrap.new-word").val("Poland"); // add translation
            $base.parent().find(".apply").trigger("click"); // click the button
            $("body").trigger("click"); // click the button

            $base.parent().find("#PL").trigger("click");
            $base.parent().find(".current-language .translated").val('Zmieniony tekst polski');
            $base.parent().find(".update").trigger("click");

            var updatedLanguageValue = $base.parent().find("#PL > input").val();

            expect(updatedLanguageValue).toBe("Zmieniony tekst polski");
        });
    });
});

