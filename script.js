const logicF = async () => {
        const conatiner = document.querySelector(".container");
        const { transactions } = await getuser();
        const dateTransactions = {};
        for (const [index, { startDate }] of transactions.entries()) {
          const date = startDate.split("T")[0];
          if (!dateTransactions[date]) dateTransactions[date] = [];
          dateTransactions[date].push(transactions[index]);
        }
        for (const dateTrans in dateTransactions) {
          conatiner.insertAdjacentHTML("beforeend", genMarkupDate(dateTrans));
          for (const trans of dateTransactions[dateTrans]) {
            conatiner.insertAdjacentHTML("beforeend", genMarkupTrans(trans));
          }
        }
      };

      const getuser = async () => {
        const data = await fetch(
          "https://dev.onebanc.ai/assignment.asmx/GetTransactionHistory?userId=1&recipientId=2"
        ).then((r) => r.json());
        return data;
      };

      const genMarkupDate = (date) => {
        return `<div class="trans__date">
            <p>${date}</p>
          </div>`;
      };

      const genMarkupTrans = (trans) => {
        const { id, amount, direction, status, type, startDate } = trans;
        let direction_html,
          type_html,
          status_html,
          cancel_btn,
          pay_btn,
          decline_btn;
        if (status === 2 && direction === 2) {
          direction_html = "left";
          type_html = "You Received";
          status_html = "✓";
        } else if (status === 2 && direction === 1) {
          direction_html = "right";
          type_html = "You Paid";
          status_html = "✓";
        } else if (status === 1 && direction === 1 && type === 2) {
          direction_html = "right";
          type_html = "You Requested";
          status_html = "👁";
          cancel_btn = true;
        } else if (status === 1 && direction === 2 && type === 2) {
          direction_html = "left";
          type_html = "Request Received";
          status_html = "👁";
          pay_btn = decline_btn = true;
        } else if (status === 1 && direction === 1 && type === 1) {
          direction_html = "right";
          type_html = "Request Received";
          status_html = "👁";
        } else if (status === 1 && direction === 2 && type === 1) {
          direction_html = "ledt";
          type_html = "Request Received";
          status_html = "👁";
        }

        return `<div class="${direction_html}" style="margin-bottom:10px;">
            <div class="transbox">
                  <div class="info">
                      <h1>₹ ${amount}</h1>
                      <br>
                      ${
                        cancel_btn || pay_btn || decline_btn
                          ? cancel_btn
                            ? `<button>Cancel</button>`
                            : `<button>Pay</button>
                            <button>Decline</button>`
                          : `<p>Transaction ID</p>
                          <p>${id}</p>`
                      }
                  </div>
                  <div style="position:relative">
                      <p>${status_html} ${type_html}</p>
                      <br>
                      <p class="symbol"></p>
                      <p style="position:absolute;bottom:0;right:0;font-size:30px;">></p>
                  </div>
              </div>
              <p style="text-align:right;">${startDate}</p>
            <div>`;
      };

      document.addEventListener("DOMContentLoaded", logicF);