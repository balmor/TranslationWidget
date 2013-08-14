describe("Translation widget", function() {

    beforeEach(function(){
        $container = $('<div class="control-group"><label class="control-label">Translation</label><div class="controls"></div></div>').appendTo('form');
        $base = $('<input type="text" class="m-wrap lang-translation" name="test" disabled />').appendTo($container.children(".controls"));
        $wi = $base.formWidget();
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
});

