var myBills = document.querySelector('.mybill');
myBills.addEventListener('click', () => {

    startApp();
    console.log("App has Started")
})


const supportedCards = {
    visa: "images/visa.jpg",
    mastercard: "images/mastercard.jpg"
};

const countries = [{
        code: "US",
        currency: "USD",
        currencyName: '',
        country: 'United States'
    },
    {
        code: "NG",
        currency: "NGN",
        currencyName: '',
        country: 'Nigeria'
    },
    {
        code: 'KE',
        currency: 'KES',
        currencyName: '',
        country: 'Kenya'
    },
    {
        code: 'UG',
        currency: 'UGX',
        currencyName: '',
        country: 'Uganda'
    },
    {
        code: 'RW',
        currency: 'RWF',
        currencyName: '',
        country: 'Rwanda'
    },
    {
        code: 'TZ',
        currency: 'TZS',
        currencyName: '',
        country: 'Tanzania'
    },
    {
        code: 'ZA',
        currency: 'ZAR',
        currencyName: '',
        country: 'South Africa'
    },
    {
        code: 'CM',
        currency: 'XAF',
        currencyName: '',
        country: 'Cameroon'
    },
    {
        code: 'GH',
        currency: 'GHS',
        currencyName: '',
        country: 'Ghana'
    }
];

const billHype = () => {
    const billDisplay = document.querySelector('.mdc-typography--headline4');
    if (!billDisplay) return;

    billDisplay.addEventListener('click', () => {
        const billSpan = document.querySelector("[data-bill]");
        if (billSpan &&
            appState.bill &&
            appState.billFormatted &&
            appState.billFormatted === billSpan.textContent) {
            window.speechSynthesis.speak(
                new SpeechSynthesisUtterance(appState.billFormatted)
            );
        }
    });
};

const appState = {};

// const formatAsMoney = (amount, buyerCountry) => {
//     const country = countries.find(c => c.country === buyerCountry) || countries[0];
//     const {currency,code} = country;
//     return amount.toLocaleString(`en-${code}`,{style:'currency',currency}) };


// const flagIfInvalid = (field, isValid) => {
//     if(isValid){
//         return field.classList.remove('is-invalid');
//     }else {
//         return field.classList.add('is-invalid');
//     }
// }

const formatAsMoney = (amount, buyerCountry) => {
    const country = countries.find((id) => buyerCountry === id.country);
    if (!country) {
        this.countryCode = countries[0].code;
        this.formatCurrency = countries.currency;
    } else {
        this.countryCode = country.code;
        this.formatCurrency = country.currency;
    }

    return amount.toLocaleString(`en-${this.countryCode}`, {
        style: 'currency',
        currency: this.formatCurrency
    });
}

const flagIfInvalid = (field, isValid) => {
    if (isValid !== true) {
        field.classList.add('is-invalid');
    } else {
        field.classList.remove('is-invalid');
    }
}

const expiryDateFormatIsValid = (field) => {
    //return RegExp(/^[\d]{2}\/[\d]{2}$/.test(field.value));
    /* return /^\d{1,}\/\d{2}$/g.test(field.value); */
    return /^(0[1-9]|1[0-2])\/([0-9][0-9])$/g.test(field.value);
}

//const detectCardType = (first4Digits) => {}
const detectCardType = (first4Digits) => {
    const fieldOne = document.querySelector('[data-credit-card]');
    const fieldType = document.querySelector('[data-card-type]');
    if(first4Digits.toString().startsWith(4)){
        fieldOne.classList.add('is-visa');
        fieldOne.classList.remove('is-mastercard');
        fieldType.src = supportedCards.visa;
        return 'is-visa';
    } else if(first4Digits.toString().startsWith(5)){
        fieldOne.classList.add('is-mastercard');
        fieldOne.classList.remove('is-visa');
        fieldType.src = supportedCards.mastercard;
        return "is-mastercard";

    }
    else{
        creditCard.remove('is-mastercard');
        creditCard.remove('is-visa');
        cardTypeField.src = 'https://placehold.it/120x60.png?text=card';
    }
    return cardType;
};


const validateCardExpiryDate = () => {
    let field = document.querySelector('[data-cc-info] input:nth-child(2)')
    let isValid = expiryDateFormatIsValid(field);
    if (isValid === true) {
        console.log("date is corect");
    } else {
        console.log("date is not corect");
    };
    flagIfInvalid(field, isValid);
    return isValid;
}

// const validateCardExpiryDate = () => {
//     const target = document.querySelector('[data-cc-info] input:nth-child(2)');
//     const currentDate = new Date();
//     const ds = target.value.split('/');
//     const userDate = new Date(`20${Number(ds[1])}`, (Number(ds[0]-1) + 2));
//     const valid = (expiryDateFormatIsValid(target) && (userDate >= currentDate));
//     flagIfInvalid(target, valid);
//     return valid;
// }


const validateWithLuhn = (digits) =>{
    let total = 0;
    let sumOddCardNum = 0;
    let sumEvenCardNum = 0;

    for(let i=0; i < digits.length;  i++){
        if(i % 2 === 0){
            if(digits[i]*2 > 9){
                sumEvenCardNum += digits[i] * 2 - 9;
            }else {
                sumEvenCardNum += digits[i] * 2;
            }
        } else {
            sumEvenCardNum += digits[i];
        }
    }
    total = sumOddCardNum + sumEvenCardNum;
    return total % 10 === 0;
};

const validateCardNumber = () =>{
    const cardInputs = appState.cardDigits.flat();
    const isValid = validateWithLuhn(cardInputs);
    const creditCardField = document.querySelector('[data-cc-digits]');
    if(isValid){
        creditCardField.classList.remove('is-invalid');
    }
    else{
        creditCardField.classList.add('is-invalid')
    }
    return isValid
};

/*use flagIfValid function when the entry is wirong */
const validateCardHolderName = () => {
    const field = document.querySelector('[data-cc-info] input:nth-child(1)');
    const namePattern = /^[a-zA-z]{3,}\s[a-zA-Z]{3,}$/;
    let isValid = namePattern.test(field.value);
    if (isValid === true) {
        console.log("name is corect");
    } else {
        console.log("name is not corect");
    };
    flagIfInvalid(field, isValid);
    return isValid;
}



//const validateCardNumber = () => {}

const validatePayment = () => {
    validateCardNumber();
    validateCardHolderName();
    validateCardExpiryDate();
    
}


const smartCursor = (event, fieldIndex, fields) => {
};

const enableSmartTyping = () => {
    let allFields = document.querySelectorAll('input');
    allFields.forEach((field, index, fields)=> {
        field.addEventListener('keydown', (event) => {
            smartInput(event, index, fields)
        })
    })
}

//const smartInput = (event, fieldIndex, fields) => {};
const smartInput = (event, fieldIndex, fields) => {
    const e = event.key;
    const validCharacters = e == 'Backspace' || e == 'Tab' || e == 'Shift' || e == 'ArrowUp' || e == 'ArrowDown' || e == 'ArrowRight' || e == 'ArrowLeft';
    if(fieldIndex < 4) {
        if(!isFinite(e) && !validCharacters) {
            event.preventDefault();
        }
        else {
            const cardInputField = document.querySelector(`[data-cc-digits] input:nth-child(${fieldIndex + 1})`);
        let cardValue = cardInputField.value;
        const firstField = document.querySelector('[data-cc-digits] input:nth-child(1)').value.length;
        if(appState.cardDigits[fieldIndex] == undefined && isFinite(e)) {
            appState.cardDigits[fieldIndex] = [];
            appState.cardDigits[fieldIndex].push(e);
            const digits = appState.cardDigits[0];
            detectCardType(digits);
        }
        else if (isFinite(e)) {
            appState.cardDigits[fieldIndex].push(e);
        }
        setTimeout(() => {
            if(fieldIndex < 3 && isFinite(e)) {
                cardInputField.value = cardInputField.value.substr(0, cardValue.length);
                cardInputField.value += '$';
            };
            if (fieldIndex == 0) {
                detectCardType(appState.cardDigits[0]);
            };
        }, 500);
        smartCursor(event, fieldIndex, fields);
        }
    }
    else if(fieldIndex == 4) {
        if (!validCharacters && !/^[a-zA-Z]$/.test(e) && event.code != 'Space') {
            event.preventDefault();
        }
        else {
            smartCursor(event, fieldIndex, fields)
        }
    }
else if (fieldIndex == 5) {
            if (!validCharacters && !/^[0-9]$/.test(e) ) {
            event.preventDefault();
        }
        else {
            smartCursor(event, fieldIndex, fields)
        }
}
}		


const uiCanInteract = () => {
    document.querySelector('[data-cc-info] input:nth-child(1)').focus();
    document.querySelector('[data-pay-btn]').addEventListener('click', validatePayment());
    billHype();
    enableSmartTyping();
}

const displayCartTotal = ({results}) => {
    const [data] = results;
    const {itemsInCart,buyerCountry} = data;
    appState.items = itemsInCart;
    appState.country = buyerCountry;
    console.log(appState.country);
    appState.bill = itemsInCart.reduce((total, current) => total + (current.price * current.qty), 0)
    //console.log(appState.bill);
    appState.billFormatted = formatAsMoney(appState.bill, appState.country);
    //console.log(appState.billFormatted);

    document.querySelector("span[data-bill]").textContent = appState.billFormatted
    appState.cardDigits = [];
    uiCanInteract();
}

const fetchBill = () => {
    const apiHost = 'https://randomapi.com/api';
    const apiKey = '006b08a801d82d0c9824dcfdfdfa3b3c';
    const apiEndpoint = `${apiHost}/${apiKey}`;
    fetch(apiEndpoint)
        .then((response) => response.json())
        .then(data => displayCartTotal(data))
        .catch(error => console.log(error))
};

const startApp = () => {
    fetchBill();
};

//startApp(); 