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

//период start / end

const timeStart = document.querySelector(".period-input__start"),
  timeEnd = document.querySelector(".period-input__end"),
  errorMessage = document.querySelector(".period-input__error-message");

function errorInput() {
  timeStart.classList.add("period-input__error");
  timeEnd.classList.add("period-input__error");
  errorMessage.classList.remove("display-none");
  errorMessage.classList.remove("period-input__error-message_hide");
}

function removeErrorInput() {
  timeStart.classList.remove("period-input__error");
  timeEnd.classList.remove("period-input__error");
  errorMessage.classList.add("period-input__error-message_hide");
  setTimeout(() => {
    if (errorMessage.classList.contains("period-input__error-message_hide"))
      errorMessage.classList.add("display-none");
  }, 500);
}

function compareDates(start, end) {
  const startDate = new Date(start);
  const endDate = new Date(end);

  return startDate > endDate;
}

timeStart.addEventListener("input", () => {
  if (timeEnd.value !== "") {
    if (compareDates(timeStart.value, timeEnd.value)) {
      errorInput();
    } else {
      removeErrorInput();
      filterData();
    }
    Array.from(periodButton.children).forEach((item) => {
      item.classList.remove("period-buttons__btn_active");
    });
  }
});

timeEnd.addEventListener("input", () => {
  if (timeStart.value !== "") {
    if (compareDates(timeStart.value, timeEnd.value)) {
      errorInput();
    } else {
      removeErrorInput();
      filterData();
    }
    Array.from(periodButton.children).forEach((item) => {
      item.classList.remove("period-buttons__btn_active");
    });
  }
});

//выбор периода

const periodButton = document.querySelector(".period-buttons");

periodButton.addEventListener("click", (e) => {
  const target = e.target;
  if (target.classList.contains("period-buttons__btn")) {
    const currentDate = new Date();
    timeEnd.value = currentDate.toISOString().slice(0, 16);

    switch (target.innerText) {
      case "День":
        currentDate.setDate(currentDate.getDate() - 1);
        break;
      case "Неделя":
        currentDate.setDate(currentDate.getDate() - 7);
        break;
      case "2 недели":
        currentDate.setDate(currentDate.getDate() - 14);
        break;
      case "Месяц":
        currentDate.setMonth(currentDate.getMonth() - 1);
        break;
      case "3 месяца":
        currentDate.setMonth(currentDate.getMonth() - 3);
        break;
      case "Полгода":
        currentDate.setMonth(currentDate.getMonth() - 6);
        break;
    }

    timeStart.value = currentDate.toISOString().slice(0, 16);
    filterData();
    Array.from(periodButton.children).forEach((item) => {
      item.classList.remove("period-buttons__btn_active");
    });
    target.classList.add("period-buttons__btn_active");
  }
});

//Запрос к серверу

const tableAnalys = document.querySelector("tbody");

let serverData = [];

fetch(
  "https://raw.githubusercontent.com/RammFire2103/botanique/refs/heads/main/server/db/data.json"
)
  .then((res) => res.json())
  .then((res) => res.data)
  .then((res) => {
    serverData = res;
    rerenderTable(serverData);
  });

function filterData() {
  const start = new Date(timeStart.value),
    end = new Date(timeEnd.value);

  filteredData = serverData.filter((value) => {
    const arr = value.startTime.replace(" ", ".", ":").split(".");
    const valueDate = new Date(
      arr[2] + "-" + arr[1] + "-" + arr[0] + "T" + arr[3]
    );
    return valueDate >= start && valueDate < end;
  });

  rerenderTable(filteredData);
}

function rerenderTable(rows) {
  const table = document.querySelectorAll(".table__row-data");
  table.forEach((item) => item.remove());

  rows.forEach((item) => {
    const startTime = `<p>${item.startTime}</p>`;
    const workType = `
              <p>
                <span class="type">${item.workType.split("\n")[0]}</span><br />
                ${item.workType.split("\n")[1]}
              </p>`;

    const works = item.works.split("\n");

    let work = `<p>`;

    works.forEach((item) => {
      work += `<b>${item.split(":")[0]}:</b>${item.split(":")[1]}<br />`;
    });

    work += `</p>`;

    const result = `
              <p>
                ${item.result}
              </p>
              <div></div>`;
    const user = `<a href="#">${item.user}</a>`;
    const tr = document.createElement("tr");
    tr.classList.add("table__row-data");

    tr.innerHTML = `
    <td class="table__cell-data table__cell-data_analys">
      ${startTime}
    </td>
    <td class="table__cell-data table__cell-data_analys">
      ${workType}
    </td>
    <td class="table__cell-data table__cell-data_analys">
      ${work}
    </td>
    <td class="table__cell-data table__cell-data_analys table__cell-data_result">
      ${result}
    </td>
    <td class="table__cell-data table__cell-data_analys">
      ${user}
    </td>`;

    tableAnalys.append(tr);
  });
}

const favorite = document.querySelector(".favorite");

favorite.addEventListener("click", (e) => {
  console.log(e.currentTarget.children[0].children[0].style);
  if (
    e.currentTarget.children[0].children[0].style.fill == "rgb(238, 63, 68)"
  ) {
    e.currentTarget.children[0].children[0].style.fill = "rgb(122,122,122)";
  } else {
    e.currentTarget.children[0].children[0].style.fill = "rgb(238, 63, 68)";
    e.currentTarget.children[0].children[0].style.fillOpacity = "1";
  }
});
