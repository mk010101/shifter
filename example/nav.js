import {Shifter} from "./Shifter.js";


// data stub -----------------------------------------------------------------------------------------------------------

let pagesData = [];
for (let i = 0; i < 10; i++) {
    let page = {
        numId: i,
        title: "Page Title: " + (i),
        image: {
            src: "../assets/1.jpg"
        },
        text: `<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
            Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took 
            a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, 
            but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in 
            the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with 
            desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p><p>Lorem Ipsum is 
            simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard 
            dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a 
            type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, 
            remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets 
            containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker 
            including versions of Lorem Ipsum.</p><p>Lorem Ipsum is simply dummy text of the printing and typesetting 
            industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown 
            printer took a galley of type and scrambled it to make a type specimen book. It has survived not only 
            five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. 
            It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, 
            and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>`
    };
    pagesData.push(page);
}

// PagesViewer ---------------------------------------------------------------------------------------------------------

class PagesViewer {


    constructor(data) {

        this._html = null;
        this._pagesDataArr = data.pagesData;
        this._children = [];
        this._initPos = data.position;
        this._curretPage = null;

        this._shifter = null;

        this._gap = 50;

        let p = new Page(data.pagesData[data.position]);
        this._children.push(p);


        this._init();
    }


    _init() {
        this._onShifterStart = this._onShifterStart.bind(this);
        this._onPanXEnd = this._onPanXEnd.bind(this);
    }

    render(parent) {
        this._html = parent;
        for (let i = 0; i < this._children.length; i++) {
            this._children[i].render(this._html);
        }

        this._setUpShifter();

        if (this._initPos < this._pagesDataArr.length - 1) {
            this._addPageRight(this._initPos + 1);
        }

        if (this._initPos > 0) {
            this._addPageLeft(this._initPos - 1);
        }
    }

    addChild() {

    }


    _setUpShifter() {
        this._shifter = new Shifter(this._html, [Shifter.Func.PAN_X]);

        //this._shifter.on(Shifter.Evt.START, this._onShifterStart);
        this._shifter.on(Shifter.Evt.UP, this._onPanXEnd);

    }

    _addPageRight(pageNumId) {
        let p = new Page(this._pagesDataArr[pageNumId]);
        p.x = this._html.getBoundingClientRect().right + this._gap;
        p.render(this._html);
        this._children.push(p);
    }

    _addPageLeft(pageNumId) {
        let p = new Page(this._pagesDataArr[pageNumId]);
        let rect = this._html.getBoundingClientRect();
        p.x = rect.left - this._gap - rect.width;
        p.render(this._html);
        this._children.unshift(p);
    }


    _onShifterStart() {
        glide.remove(this._html);
    }

    _onPanXEnd() {


        let speed = this._shifter.speedX;
        let minSpeed = 3;

        //console.log(speed)

        //console.log(this._shifter.gestureDuration)
        //console.log(speed)

        let closestPage = this._children.reduce((prev, curr) => {
            return Math.abs(prev.boundsX) < Math.abs(curr.boundsX) ? prev : curr;
        });
        let index = this._children.indexOf(closestPage);

        /// User swipe slow ------
        if (speed < -minSpeed && index < this._children.length - 1) {
            this._move(this._children[index + 1]);
        } else if (speed > minSpeed && index > 0) {
            this._move(this._children[index - 1]);
        } else {
            this._move(closestPage);
        }
    }

    _move(page) {
        this._shifter.disabled = true;
        let pos = this._html.getBoundingClientRect().left - page.boundsX;
        glide.to(this._html, 300,
            {t: {translateX: pos}},
            {ease: glide.Ease.quadOut})
            .on("end", () => {
                this._shifter.disabled = false;
                this._curretPage = page;
            });
    }


    _removeInactivePages() {

    }


}


// Page ----------------------------------------------------------------------------------------------------------------

class Page {

    constructor(data) {
        this._parent = null;
        this.numId = data.numId;
        this._data = data;
        this._html = "";
        this._x = 0;
        this._init();
    }

    _init() {

    }

    render(parent) {

        let str = "";

        str += `<div><h3>${this._data.title}</h3></div>
        <section class="page-content">
            <div class="media"><img src="../assets/1.jpg" alt="Hello world!"><div class="hotspot"></div></div>
            <div>${this._data.text}</div>
        </section>
    `;

        let p = document.createElement("div");
        p.setAttribute("data-id", this.numId);
        p.classList.add("page");
        p.innerHTML = str;
        this._html = p;
        this.x = this._x;
        parent.appendChild(p);
        this._parent = parent;
    }

    get html() {
        return this._html;
    }

    set x(valueNum) {
        this._x = valueNum;
        if (this._html) this._html.style.transform = `translateX(${valueNum}px)`;
    }

    get x() {
        return this._x;
    }

    get boundsX() {
        return this._html.getBoundingClientRect().left;
    }

    dispose() {
        this._parent.removeChild(this._html);
        this._parent = null;
    }

}

// ---------------------------------------------------------------------------------------------------------------------

const pViewer = new PagesViewer({
    pagesData: pagesData,
    position: 2,
    parent: document.querySelector(".pages-container")
});
pViewer.render(document.querySelector(".pages-container"));


//-------------------------------------------------------------------------------------------


/*



function setListeners() {

    shifter.on(Shifter.Events.PAN_X_START, ()=> shiftStart());

    shifter.on(Shifter.Events.START, (e) => {
        glide.remove(pContainer);
    });

    shifter.on(Shifter.Events.ENDZZZZ, () => {

        if (shifter.speedX < -5) {
            addPageNext();
            glide.to(pContainer, 300, {t: {x: shifter.targetX - pages[pages.length-1].html.getBoundingClientRect().left}}, {ease: glide.Ease.quadOut});
        } else if (shifter.speedX > 5) {
            glide.to(pContainer, 300, {t: {x: [shifter.targetX, 0]}}, {ease: glide.Ease.quadOut});
        }

    });

}


 */



















