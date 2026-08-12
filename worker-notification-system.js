// Worker Notification & Real-time Order Listener Logic

function updateWorkerDutyStatus(workerId, isDutyOn, selectedArea) {
    const workerData = {
        dutyOn: isDutyOn,
        area: selectedArea,
        lastUpdated: new Date().toISOString()
    };

    // Firebase Database Update:
    // db.collection('workers').doc(workerId).update(workerData);
    console.log(`Worker Duty Status: ${isDutyOn ? 'ON' : 'OFF'} for Area: ${selectedArea}`);
}

function listenForIncomingOrders(workerArea, workerServiceType) {
    /*
    db.collection('bookings')
      .where("status", "==", "Pending")
      .where("serviceCategory", "==", workerServiceType)
      .where("customerArea", "==", workerArea)
      .onSnapshot((snapshot) => {
          snapshot.docChanges().forEach((change) => {
              if (change.type === "added") {
                  const order = { bookingId: change.doc.id, ...change.doc.data() };
                  showOrderNotification(order);
              }
          });
      });
    */
}

function showOrderNotification(order) {
    // Check for duplicate card
    if (document.getElementById(`order-${order.bookingId}`)) return;

    // Safe Sound Play
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    audio.play().catch(() => console.log("Audio blocked by browser policy"));

    const ordersContainer = document.getElementById('orders-section');
    if (!ordersContainer) return;
    
    const orderCard = document.createElement('div');
    orderCard.id = `order-${order.bookingId}`;
    orderCard.className = "bg-gray-800 border-2 border-purple-500 p-5 rounded-2xl flex flex-col gap-4 mb-4 shadow-xl shadow-purple-500/10 transition-all";
    
    orderCard.innerHTML = `
        <div class="flex justify-between items-start">
            <div>
                <span class="bg-purple-600/30 text-purple-300 border border-purple-500/40 text-xs px-3 py-1 rounded-full font-semibold">${order.serviceCategory || 'Service'}</span>
                <p class="text-sm text-gray-300 mt-3"><strong>Vel:</strong> ${order.appointmentDate || 'Today'}, ${order.appointmentTime || 'ASAP'}</p>
            </div>
            <div class="text-right">
                <span class="text-emerald-400 font-extrabold text-xl">₹ ${order.offeredPayment}</span>
                <p class="text-xs text-gray-400">Offered Budget</p>
            </div>
        </div>

        <div class="flex items-center gap-4 bg-gray-900/90 p-3 rounded-xl border border-gray-700">
            <img src="${order.photoUrl || 'https://via.placeholder.com/150'}" alt="Problem Photo" class="w-16 h-16 object-cover rounded-lg border border-gray-700">
            <div>
                <p class="text-xs text-purple-400 font-semibold">Exact Location:</p>
                <p class="text-sm text-white font-medium line-clamp-2">${order.manualAddress}</p>
            </div>
        </div>

        <div class="flex gap-3 mt-1">
            <button onclick="acceptOrder('${order.bookingId}')" class="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-bold text-sm transition shadow-lg shadow-emerald-900/20 active:scale-[0.98]">
                Accept Order
            </button>
            <button onclick="rejectOrder('${order.bookingId}')" class="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-200 py-3 rounded-xl font-semibold text-sm transition active:scale-[0.98]">
                Reject
            </button>
        </div>
    `;
    
    ordersContainer.prepend(orderCard);
}

function acceptOrder(bookingId) {
    /*
    db.collection('bookings').doc(bookingId).update({
        status: "Accepted",
        workerId: currentWorkerId
    }).then(() => {
        window.location.href = `map-view.html?bookingId=${bookingId}`;
    });
    */
    alert("Order Accepted! Map navigation var redirect hot ahot.");
    window.location.href = `map-view.html?bookingId=${bookingId}`;
}

function rejectOrder(bookingId) {
    const card = document.getElementById(`order-${bookingId}`);
    if (card) card.remove();
}
