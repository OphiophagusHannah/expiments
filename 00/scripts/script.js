document.getElementById("destroy").addEventListener("click", function () {
    document.getElementById("img").classList.add("img");
    document.getElementById("background").classList.add("invisible");
    /*   PIXI 5 Setup  */
    const app = new PIXI.Application({
        width: window.innerWidth,
        height: window.innerHeight,
        antialias: true,
        transparent: false,
        backgroundColor: 0x303030,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
    });
    document.body.appendChild(app.view);


    // let scene_Width = 1680;
    // let scene_Height = 905;
    let element_width = app.screen.width / 70 - 8;
    let speed = 0.5;
    let time;


    const scene = new PIXI.Container();
    app.stage.addChild(scene);

    const bg_stage = new PIXI.Container();
    app.stage.addChild(bg_stage);
    bg_stage.visible = false;

    const imageBg = PIXI.Sprite.from(document.getElementById("img"))
    imageBg.width = app.screen.width;
    imageBg.height = app.screen.height;
    bg_stage.addChild(imageBg);

    let displacementSprite = PIXI.Sprite.from("https://www.onlygfx.com/wp-content/uploads/2017/07/paint-texture-black-and-white-1.jpeg");
    // displacementSprite.anchor.set(0.5)
    displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
    bg_stage.addChild(displacementSprite);

    const displacementFilter = new PIXI.filters.DisplacementFilter(displacementSprite);
    displacementFilter.scale.x = 10;
    displacementFilter.scale.y = 10;
    imageBg.filters = [displacementFilter];


    // Get color from certain pixel in image (using Canvas API)
    const image = new Image();
    image.crossOrigin = "Anonymous";
    image.src = "https://experiments-sketches.vercel.app/00/hannah-avgust-mushroom-peekaboo.jpg";
    image.onload = function () {
        const canvas2 = document.createElement("canvas");
        canvas2.width = app.screen.width;
        canvas2.height = app.screen.height;
        const context = canvas2.getContext("2d");
        context.drawImage(image, 0, 0, app.screen.width, app.screen.height);

        for (y = 0; y < app.screen.height; y += app.screen.width / 70) {
            for (x = 0; x < app.screen.width; x += app.screen.width / 70) {
                let data = canvas2.getContext(("2d")).getImageData(x, y, 1, 1).data;
                hex = rgbToHex(data[0], data[1], data[2]);

                //make circle from every listed pixel
                let circle = new PIXI.Graphics();
                circle.beginFill(hex);
                // circle.drawCircle(0, 0, element_width/1.5)
                circle.drawRect(-8, -8, element_width, element_width)
                circle.endFill();
                circle.x = x;
                circle.y = y;
                scene.addChild(circle);
                circle.interactive = true;
                circle.buttonMode = true;
                circle.on('pointerdown', clickFx);
                circle.on('mouseover', hoverFx);
            }
        }
        scene.x = 0;  //fix

        autoAnimation()
    }


    function clickFx() {

        animationClick.seek(105);
        this.interactive = false;
        tickerDisplacement.start()
        bg_stage.visible = true;
        imageBg.mask = this;

        animationClick = gsap.fromTo(this, { width: element_width, left: 0, right: 0, height: element_width }, { width: 200, height: 200, left: -10, right: -10, radius: 150, duration: 1.5, repeat: 1, yoyo: true, onComplete: clickStop, onCompleteParams: [this] })

    }


    function clickStop(el) {
        el.interactive = true;
        tickerDisplacement.stop();

        //Resetting Values
        displacementFilter.scale.x = 90;
        displacementFilter.scale.y = 90;
        displacementFilter.scale.x = 10;
        displacementFilter.scale.y = 10;
        speed = 100;
        speed = 0.5;

        time = new Date();
    }


    function hoverFx() {
        animationHover = gsap.fromTo(this, { width: element_width, height: element_width }, { width: element_width + 10, height: element_width + 10, duration: 0.5, repeat: 1, yoyo: true })
    }

    //Ticker for Displacement Filter
    var tickerDisplacement = new PIXI.Ticker();
    tickerDisplacement.add(displacementFx);
    function displacementFx() {
        displacementSprite.x += speed;
        displacementSprite.y += speed;
        displacementFilter.scale.x += 0.5;
        displacementFilter.scale.y += 0.5;
    }

    app.ticker.add(function () {
        if (new Date() - time > 4100) autoAnimation();
    })

    //Fix - empty animation
    let animationClick = gsap.to(this, {})
    let animationAuto = gsap.to(this, {})
    let animationHover = gsap.to(this, {})


    // functions to convert color format
    function rgbToHex(r, g, b) {
        return "0x" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    }
    function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }


    /*   PIXI content Resize  */
    window.addEventListener('resize', resizeFx);
    function resizeFx() {
        app.renderer.resize(window.innerWidth, window.innerHeight);
        sceneResize()
    }
    resizeFx();

    function sceneResize() {
        var new_width = app.screen.width;
        var new_height = app.screen.height;

        var ratio = scene.width / scene.height;
        var newRatio = new_width / new_height;

        //Landscape mode
        if (newRatio > ratio) {
            scene.height = scene.height / (scene.width / new_width);
            scene.width = new_width;
            scene.position.x = 0;
            scene.position.y = (new_height - scene.height) / 2;

            //Portrait mode
        } else {
            scene.width = scene.width / (scene.height / new_height);
            scene.height = new_height;
            scene.position.y = 0;
            scene.position.x = (new_width - scene.width) / 2;
        }

        imageBg.width = app.screen.width;
        imageBg.height = app.screen.height;
    }
});
