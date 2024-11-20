//выпадающие списки

const dropdownMenu = document.querySelectorAll(".dropdown__menu"),
  dropdownInput = document.querySelectorAll(".dropdown__input"),
  dropdown = document.querySelectorAll(".dropdown");

function hideDropdown() {
  dropdown.forEach((item) => {
    item.classList.remove("dropdown_active");
  });
  dropdownMenu.forEach((item) => {
    item.classList.add("dropdown__menu_hide");
  });
  window.removeEventListener("click", hideDropdown);
}

function changeState(e, index) {
  const target = e.target;
  if (target.nodeName == "LI") {
    let text = target.innerText;
    target.innerText = dropdownInput[index].placeholder;
    dropdownInput[index].placeholder = text;

    const list = target.parentElement.children;
    const listText = Array.from(list).map((item) => item.innerText);

    listText.sort();
    for (let i = 0; i < 2; i++) {
      list[i].innerText = listText[i];
    }

    hideDropdown();
  }
}

dropdownMenu.forEach((item, index) => {
  item.addEventListener("click", (event) => changeState(event, index));
});

dropdown.forEach((item) => {
  item.addEventListener("click", (e) => {
    e.stopPropagation();
  });
});

dropdownInput.forEach((item, index) => {
  item.addEventListener("click", (e) => {
    if (
      !dropdown[index].classList.contains("dropdown_active") &&
      dropdownMenu[index].classList.contains("dropdown__menu_hide")
    ) {
      dropdown[index].classList.add("dropdown_active");
      dropdownMenu[index].classList.remove("dropdown__menu_hide");
      window.addEventListener("click", hideDropdown);
    } else {
      dropdown[index].classList.remove("dropdown_active");
      dropdownMenu[index].classList.add("dropdown__menu_hide");
      window.removeEventListener("click", hideDropdown);
    }
  });
});

//Смена режима уведомлений

const notifications = document.querySelectorAll(".devices__notification");

notifications.forEach((noti) => {
  noti.addEventListener("click", (e) => {
    const targetClasses = e.target.classList;

    if (targetClasses.contains("devices__notification_on")) {
      targetClasses.remove("devices__notification_on");
      targetClasses.add("devices__notification_none");
    } else if (targetClasses.contains("devices__notification_none")) {
      targetClasses.remove("devices__notification_none");
      targetClasses.add("devices__notification_off");
    } else if (targetClasses.contains("devices__notification_off")) {
      targetClasses.remove("devices__notification_off");
      targetClasses.add("devices__notification_on");
    }
  });
});
