const Modal = {
    open() {
        //Abrir Modal
        //Adicionar a class active ao modal
        document.querySelector('.modal-overlay').classList.add('active');
    },
    close() {
        //Fechar modal
        //Remover a class active ao modal
        document.querySelector('.modal-overlay').classList.remove('active');
    }
}

const Storage = {
    get() {
        // console.log(localStorage)
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) ||
        [];
    },

    set(transactions) {
        localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions));
    }
 }
//  Storage.get();


// Eu preciso somar as entradas
// depois eu preciso somar as saídas e
// remover das entradas o valor da saídas
// assim, eu terei o valor toral

const Transaction = {
    // all: transactions = [
    //     {
        
    //     description: 'Luz',
    //     amount: -50000,
    //     date: '23/01/2021'
    //     },
    //     {
            
    //         description: 'Criação website',
    //         amount: 500000,
    //         date: '23/01/2021'
    //     },
    //     {
        
    //     description: 'Internet',
    //     amount: -20000,
    //     date: '23/01/2021'
    //     },
    // ],

    all: transactions = Storage.get(),

    add(transaction){
        Transaction.all.push(transaction);

        App.reload();
    },

    remove(index) {
        Transaction.all.splice(index, 1);

        App.reload();
    },

    incomes() {
        let income = 0
        //pegar todas transações
        //para cada transação,
        transactions.forEach((transaction) => {
            // se ela for maior que zero
            if(transaction.amount > 0) {
                // somar a uma variavel e retornar a variavel
                income += transaction.amount;
            }
        })        
        return income;
    },

    outcomes() {
        let outcome = 0
        transactions.forEach((transaction) => {
            if(transaction.amount < 0) {
                outcome += transaction.amount;
            }
        })        
        return outcome;
    },
    total() {
        // entradas - saídas
        return Transaction.incomes() + Transaction.outcomes();
    }
}

 const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index){
        const tr = document.createElement('tr');
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index);
        tr.dataset.index = index;

        DOM.transactionsContainer.appendChild(tr)
    }, 

    innerHTMLTransaction(transaction, index) {

        const CSSclass = transaction.amount > 0 ? "income" : "outcome"
        
        const amount = Utils.formatCurrency(transaction.amount)

        const html = `
            <td class="description">${transaction.description}</td>
            <td class="${CSSclass}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <td>
                <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover trasação">
            </td>
        </tr>
         `

         return html;
    },

    updateBalance() {
        document
            .getElementById('incomeDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.incomes());
        document
            .getElementById('outcomeDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.outcomes());
        document
            .getElementById('totalDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.total());

        return
    },

    clearTransactions() {
        DOM.transactionsContainer.innerHTML ="";
    }
 }

 const Utils = {
    formatAmount(value) {
        value = value *100;
        console.log(Math.round(value))
        return Math.round(value);
    },

    formatDate(date) {
        const splittedDate = date.split("-");
        return `${splittedDate[1]}/${splittedDate[2]}/${splittedDate[0]}`;
    },

    formatCurrency(value){

         const signal = Number(value) < 0 ? '-' : '';

         value = String(value).replace (/\D/g,"");

         value = Number(value)/ 100;

         value = value.toLocaleString("pt-BR", {
             style: "currency",
             currency: "BRL",
         })

         return signal + value;
    }
 }

 const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value,
        }
    },

    validateFields() {
        const {description, amount, date} = Form.getValues();

        if(description.trim() === "" || 
           amount.trim() === "" ||
           date.trim() === ""
        ) {
            throw new Error('Por favor, preencha todos os campos');
        }
    },

    formatValues() {
        let {description, amount, date} = Form.getValues();
        amount = Utils.formatAmount(amount);
        date = Utils.formatDate(date);

        return {
            description,
            amount,
            date,
        }
    },

    clearFields() {
        Form.description.value = "";
        Form.amount.value = "";
        Form.date.value = "";
    },

    submit() {
        event.preventDefault();
        try{
            Form.validateFields();
            const transaction = Form.formatValues();
            Transaction.add(transaction);
            Form.clearFields();
            Modal.close();
        }catch(err) {
            alert(err.message)
        }
       //  Form.formatData();
    }
 }

 const App = {
     init() {
        Transaction.all.forEach((transaction, index) => {
            DOM.addTransaction(transaction, index);
        });

        DOM.updateBalance();

        Storage.set(Transaction.all);
     },

     reload(){
         DOM.clearTransactions();
         App.init();
     },
 }

 App.init();


