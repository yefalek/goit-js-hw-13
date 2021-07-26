import {Notify} from "notiflix";
import photoCard from './templates/photoCard.hbs';
import SimpleLightbox from "simplelightbox";
import  NewsApiService  from './js/fetchImages';
import './css/style.scss';
import "../node_modules/simplelightbox/src/simple-lightbox.scss";
const lightbox = new SimpleLightbox('.gallery a');

const imageBox = document.querySelector(".gallery");
const buttonSearch = document.querySelector(".search-form");
const buttonLoadMore = document.querySelector(".load-more");

buttonSearch.addEventListener("submit", onSearch);
buttonLoadMore.addEventListener("click", onLoadMore);

const newsApiService = new NewsApiService();
function onSearch(e) {
  e.preventDefault();

  newsApiService.query = e.currentTarget.elements.searchQuery.value;

  if (newsApiService.query.trim() === '') {
    return ;
  }

    
    newsApiService.resetPage();
    clearImagesContainer();
    fetchImages();
    showBtnLoadMore();
    lightbox.refresh();
}

 async function fetchImages() {
     try {
        const data = await newsApiService.fetchImages();
        const { data: { hits }, data: { totalHits } } = data;
         
        renderImagesMarkup(hits);
        lightbox.refresh();
        
        if (hits.length === 0) {
            Notify.failure("Sorry, there are no images matching your search query. Please try again.");
            hideBtnLoadMore();
            return;
       }
       Notify.info(`Hooray! We found ${totalHits} images.`);
        
     }
     catch (error) {
        console.log("Error: ", error)
    };
};
   
async function onLoadMore() {
    
     try {
        const data = await newsApiService.fetchImages();
        const { data: { hits }, data: {totalHits }} = data;
        renderImagesMarkup(hits);
        lightbox.refresh()

        const totalPages = totalHits - (newsApiService.limit+=1);
        if (totalPages <= 0) {
            Notify.failure("We're sorry, but you've reached the end of search results.");
            hideBtnLoadMore();
         };
    }
     
     catch (error) {
         console.log("Error: ", error);
        };
};

function renderImagesMarkup(hits) {
    imageBox.insertAdjacentHTML("beforeend",photoCard(hits));
}

function clearImagesContainer() {
  imageBox.innerHTML = '';
}


function showBtnLoadMore() {
    buttonLoadMore.classList.remove("load-more");
    buttonLoadMore.classList.add("is-visible"); 
};


function hideBtnLoadMore() {
    buttonLoadMore.classList.remove("is-visible");
    buttonLoadMore.classList.add("load-more");
}