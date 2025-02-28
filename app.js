document.addEventListener("DOMContentLoaded", function () {
    const input = document.getElementById("participantInput");
    const addButton = document.getElementById("addParticipant");
    const participantList = document.getElementById("participantList");
    const addLocationButton = document.getElementById("addLocation");
    const locationContainer = document.getElementById("locationContainer");
    let participants = [];
    let locationCount = 0;

    function addParticipant() {
        const name = input.value.trim();
        if(name === "" ){
            alert('참여자를 입력하세요.')
            return;
        }
        if (participants.includes(name)) {
            alert('이미 있는 참여자입니다.')
            return;
        }

        participants.push(name);

        const span = document.createElement("span");
        span.className = "bg-gray-700 p-2 rounded-md cursor-pointer";
        span.textContent = name + " ❌";
        span.addEventListener("click", function () {
            participantList.removeChild(span);
            participants = participants.filter(p => p !== name);
            updateSelectOptions();
        });

        participantList.appendChild(span);
        requestAnimationFrame(() => {
            input.value = "";  // 입력 필드 초기화
            input.focus();     // 포커스 유지
        });


        updateSelectOptions();
    }

    function updateSelectOptions() {
        document.querySelectorAll(".participant-select").forEach(select => {
            select.innerHTML = `<option value="">참여자를 추가하세요.</option>`;
            participants.forEach(p => {
                const option = document.createElement("option");
                option.value = p;
                option.textContent = p;
                select.appendChild(option);
            });
        });
    }

    function addLocation() {
        if (participants.length === 0){
            alert('참여자가 한명도 없습니다.');
            return;
        } 
        
        
        _locationCount = $("#locationContainer").children().length +1;
        
        const locationDiv = document.createElement("div");
        locationDiv.className = "bg-gray-800 p-4 rounded-lg shadow-md mt-4";

        locationDiv.innerHTML = `
            <div class="flex justify-between items-center border-b pb-2 mb-2">
            <span class="text-lg font-bold">${_locationCount}차</span>
            <button class="text-red-500" onclick="removeLocation(this)">❌</button>
        </div>

        <label class="text-sm text-gray-400">장소 이름</label>
        <input type="text" class="w-full p-2 text-black rounded-md mb-2 location-name">

        <label class="text-sm text-gray-400">결제 금액(술값 포함 결제 총 금액)</label>
        <input type="number" class="w-full p-2 text-black rounded-md mb-2 location-amount" placeholder="${_locationCount}차 총 결제 금액을 입력하세요.">

         <label class="text-sm text-gray-400">알코올 금액<br>(술을 마신 벙이 아니거나 논알콜 구분없을 시 생략가능합니다)</label>
        <input id="alcohol_${_locationCount}" type="number" class="w-full p-2 text-black rounded-md mb-2 location-amount_alcohol  placeholder="${_locationCount}차 중 술값만 입력하세요.">

        <label class="text-sm text-gray-400">참여자 추가</label>
        <select class="participant-select w-full p-2 text-black bg-white rounded-md mb-2">
            <option value="">참여자를 추가하세요.</option>
            ${participants.map(p => `<option class='text-black' value="${p}">${p}</option>`).join('')}
        </select>

        <div class="border border-gray-700 rounded-md p-2 mt-2">
            <p class="text-center text-gray-400">${_locationCount}차 참여자 목록<br>(참여도가 100%가 아니면 조정해주세요<br>늦참일경우 참여도를 조정하시면 됩니다.<br>물론 벙주맘)</p>
               <table class="w-full text-center text-sm mt-2">
                 <thead>
                        <tr class="bg-gray-700 text-white">
                            <th class="p-2">이름</th>
                            <th class="p-2">참여도</th>
                            <th class="p-2 alcohol_${_locationCount}" style="display:none">알코올</th>
                            <th class="p-2">삭제</th>
                        </tr>
                    </thead>
                <tbody id="locationParticipants${_locationCount}">
                ${participants.map(p => `
                     <tr class="bg-gray-700">
                                <td class="p-2 names">${p}</td>
                                <td class="p-2">
                                    <input type="number" class="w-16 text-black p-1 rounded-md text-center participant-share" value="100" min="0" max="100">%
                                </td>

                                <td class="p-2  alcohol_${_locationCount}"  style="display:none">
                                    <button class="alcohol-toggle bg-blue-500 text-white px-2 py-1 rounded-md" data-status="O" onclick="toggleAlcohol(this)">O</button>
                                </td>
                                <td class="p-2">
                                    <button class="text-red-500 removeChk" onclick="removeParticipantFromLocation(this)">❌</button>
                                </td>
                            </tr>`).join('')}
                    </tbody>
                </table>
        </div>
        `;

        const select = locationDiv.querySelector(".participant-select");
        select.addEventListener("change", function () {
            addParticipantToLocation(this, `locationParticipants${_locationCount}`);
        });

        locationContainer.appendChild(locationDiv);
        locationDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
        $("#addLocation").text(`${_locationCount+1}차 추가하기`);
        $("#settleDiv").show();
    }

    function addParticipantToLocation(select, locationId) {
        const selectedValue = select.value;
        if (!selectedValue) return;

        const locationParticipants = document.getElementById(locationId);

        if ([...locationParticipants.children].some(child => child.textContent.includes(selectedValue))) {
            alert('이미 있습니다.')
            select.value = "";
            return;
        }

        const div = document.createElement("div");
        div.className = "flex justify-between items-center bg-gray-700 p-2 rounded-md";
        div.innerHTML = `
            <span class="w-1/2">${selectedValue}</span>
            <input type="number" class="w-20 text-black p-1 rounded-md text-center participant-share" value="100" min="0" max="100">%
            <button class="text-red-500 removeChk">❌</button>
        `;

        select.addEventListener("removeChk", function () {
            removeParticipantFromLocation(this);
        });
        locationParticipants.appendChild(div);
        select.value = "";
    }

  

   

    addButton.addEventListener("click", addParticipant);
    input.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            addParticipant();
        }
    });

    addLocationButton.addEventListener("click", addLocation);
});

 function removeParticipantFromLocation(element) {
        element.parentElement.remove();
}
function removeLocation(el){
    $(el).parent().parent().remove();
    _locationCount = $("#locationContainer").children().length +1;
    $("#addLocation").text(`${_locationCount}차 추가하기`);
    if(_locationCount == 1 ){
        $("#settleDiv").hide();
    }
}
$("#settleButton").click(function() {
    let includeDetails = $("input[name='calculationDetail']:checked").val() === "include";
    let result = "";
    let totalPayments = {};
    result += `정산하겠습니다 !`;
    $("#locationContainer > div").each(function(index) {
        let locationNum = index + 1;
        let locationName = $(this).find(".location-name").val() || `장소${locationNum}`;
        let amount = parseFloat($(this).find(".location-amount").val());
        let alcoholAmount = parseFloat($(this).find(".location-amount_alcohol").val()) || 0;

        if (isNaN(amount) || amount <= 0) return;

        let totalShare = 0;
        let totalAlcoholShare = 0;
        let participantData = [];
        let alcoholUsers = [];
        let nonAlcoholUsers = [];

        $(this).find(".participant-share").each(function() {
            let name = $(this).closest("tr").find(".names").text();
            let share = parseFloat($(this).val());
            let isAlcohol = $(this).closest("tr").find(".alcohol-toggle").attr("data-status") === "O";
            
            if (!isNaN(share) && share > 0) {
                totalShare += share;
                participantData.push({ name, share, isAlcohol });
                if (isAlcohol) {
                    alcoholUsers.push({ name, share });
                    totalAlcoholShare += share;
                } else {
                    nonAlcoholUsers.push({ name, share });
                }
            }
        });
        
        if (totalShare > 0) {
            result += `<br><br>${locationNum}차(${locationName})<br>${amount}원<br>============<br>`;
            participantData.forEach(({ name, share, isAlcohol }) => {
                let baseAmount = (amount - alcoholAmount) * share / totalShare;

                let alcoholCharge = isAlcohol && alcoholAmount > 0 ? (alcoholAmount * share / totalAlcoholShare) : 0;
                let amountToPay = baseAmount + alcoholCharge;

                let detailText = includeDetails ? ` (${share}%)` : "";
                let alcoholText = (alcoholAmount > 0 && includeDetails) ? (isAlcohol ? " (알콜)" : " (논알콜)") : "";

                result += `${name} (${amountToPay.toLocaleString()}원)${detailText}${alcoholText}<br>`;
                if (!totalPayments[name]) totalPayments[name] = 0;
                totalPayments[name] += amountToPay;
            });
            result += `<br>`;
        }
    });

    if (Object.keys(totalPayments).length > 0) {
        result += `<br>총합<br>============<br>`;
        Object.entries(totalPayments).forEach(([name, amount]) => {
            result += `${name} (${amount.toLocaleString()}원)<br>`;
        });
    }

    if (!result) {
        alert("장소이름 및 결제 금액을 입력해주세요.");
    } else {
        result += `<br><br>소행성 정산<br>https://sohaengseong123.github.io/Nbread/<br>`;
        $(".cal_text").show();
        $("#settlementContent").html(result);
    }
});


document.getElementById("copyButton").addEventListener("click", function() {
    const settlementText = document.getElementById("settlementContent").innerText;
    
    navigator.clipboard.writeText(settlementText).then(() => {
        alert("정산 내용이 복사되었습니다!");
    }).catch(err => {
        console.error("복사 실패:", err);
    });
});


$(document).on("keyup", ".location-amount_alcohol", function() {
    let _id = $(this).attr("id");
    if($(this).val() == ''){
        $("."+_id).hide();
    }else{
        $("."+_id).show();
    }
});

// 알코올 여부 토글 버튼 함수
function toggleAlcohol(button) {
    if (button.getAttribute("data-status") === "O") {
        button.textContent = "X";
        button.setAttribute("data-status", "X");
        button.classList.remove("bg-blue-500");
        button.classList.add("bg-red-500");
    } else {
        button.textContent = "O";
        button.setAttribute("data-status", "O");
        button.classList.remove("bg-red-500");
        button.classList.add("bg-blue-500");
    }
}