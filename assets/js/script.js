function openLoginModal(event){
    document.querySelector("#login-modal").classList.toggle('hide-modal')
}

addGlobalEventListener('click', openLoginModal, '#login-button');

function addGlobalEventListener(typeOfEvent, callback, selector, stopPropagation=true) {
    document.addEventListener(typeOfEvent, (eventObj) => {
        if (eventObj.target.matches(selector)) callback(eventObj);
        if (stopPropagation) eventObj.stopPropagation();
    })
}