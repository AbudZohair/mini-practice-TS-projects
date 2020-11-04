"use strict";
class Slider {
    constructor() {
        this.cacheDOMNode();
        this.bindEvents();
        this.initializeImagesTracker();
        this.showFirstImage();
        this.displaySlideNumber();
        this.showIndicators();
        this.activeOnloadIndicator();
    }
    cacheDOMNode() {
        this.sliderImages = Array.from(document.querySelectorAll('.slider-container img'));
        this.prevButton = document.querySelector('.slider-controls #prev');
        this.nextButton = document.querySelector('.slider-controls #next');
        this.slideNumber = document.querySelector('#slide-number');
        this.indicators = document.querySelector('#indicators');
    }
    bindEvents() {
        this.nextButton.addEventListener('click', () => {
            this.nextImage();
            this.changeCurrentImageIndex('next');
            this.displaySlideNumber();
            this.syncIndicatorWithDisplayedImage(this.imagesTracker.currentImageIndex);
        });
        this.prevButton.addEventListener('click', () => {
            this.prevImage();
            this.changeCurrentImageIndex('prev');
            this.displaySlideNumber();
            this.syncIndicatorWithDisplayedImage(this.imagesTracker.currentImageIndex);
        });
        this.indicators.addEventListener('click', e => this.toggleViaIndicators(e));
    }
    nextImage() {
        this.sliderImages[this.imagesTracker.currentImageIndex].classList.remove('active');
        this.sliderImages[this.imagesTracker.nextImageIndex].classList.add('active');
    }
    prevImage() {
        this.sliderImages[this.imagesTracker.currentImageIndex].classList.remove('active');
        this.sliderImages[this.imagesTracker.prevImageIndex].classList.add('active');
    }
    initializeImagesTracker() {
        const random = Math.floor(Math.random() * this.sliderImages.length);
        this.imagesTracker = {
            currentImageIndex: random,
            nextImageIndex: random === this.sliderImages.length - 1 ? 0 : random + 1,
            prevImageIndex: random === 0 ? this.sliderImages.length - 1 : random - 1
        };
    }
    showFirstImage() {
        this.sliderImages[this.imagesTracker.currentImageIndex].classList.add('active');
    }
    displaySlideNumber() {
        this.slideNumber.innerText = `${this.imagesTracker.currentImageIndex + 1}`;
    }
    showIndicators() {
        const ul = document.createElement('ul');
        this.sliderImages.forEach((image, index) => {
            const li = document.createElement('li');
            li.textContent = `${index + 1}`;
            ul.appendChild(li);
        });
        this.indicators.append(ul);
    }
    toggleViaIndicators(e) {
        const listItems = Array.from(this.indicators.querySelectorAll('ul li'));
        if (e.target.matches('.indicators li')) {
            this.removeActiveClass(listItems);
            e.target.classList.add('active');
        }
        else {
            return;
        }
        this.changeCurrentImageIndex('', listItems.indexOf(e.target));
        this.displayImage(listItems.indexOf(e.target));
        this.displaySlideNumber();
    }
    syncIndicatorWithDisplayedImage(currentImageIndex) {
        const listItems = Array.from(this.indicators.querySelectorAll('ul li'));
        this.removeActiveClass(listItems);
        listItems[currentImageIndex].classList.add('active');
    }
    displayImage(imageIndex) {
        this.removeActiveClass(this.sliderImages);
        this.sliderImages[imageIndex].classList.add('active');
    }
    activeOnloadIndicator() {
        const listItems = Array.from(this.indicators.querySelectorAll('ul li'));
        listItems[this.imagesTracker.currentImageIndex].classList.add('active');
    }
    changeCurrentImageIndex(direction, number = this.imagesTracker.currentImageIndex) {
        if (direction === 'next') {
            this.imagesTracker.currentImageIndex = this.imagesTracker.nextImageIndex;
        }
        else if (direction === 'prev') {
            this.imagesTracker.currentImageIndex = this.imagesTracker.prevImageIndex;
        }
        else {
            this.imagesTracker.currentImageIndex = number;
        }
        this.imagesTracker.nextImageIndex =
            this.imagesTracker.currentImageIndex + 1 > this.sliderImages.length - 1
                ? 0
                : this.imagesTracker.currentImageIndex + 1;
        this.imagesTracker.prevImageIndex =
            this.imagesTracker.currentImageIndex === 0
                ? this.sliderImages.length - 1
                : this.imagesTracker.currentImageIndex - 1;
    }
    removeActiveClass(parent) {
        parent.forEach(item => item.classList.remove('active'));
    }
}
document.addEventListener('DOMContentLoaded', function () {
    new Slider();
});
