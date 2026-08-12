// Customer Booking Submission & Real-time Status Listener (Firebase v9+ Compatible)

document.getElementById('booking-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // 1. Form Values Collection
    const serviceType = document.getElementById('service-type').value;
    const photoFileInput = document.getElementById('problem-photo');
    const photoFile = photoFileInput.files[0];
    const paymentBudget = document.getElementById('payment-budget').value;
    const date = document.getElementById('appointment-date').value;
    const time = document.getElementById('appointment-time').value;
    const manualAddress = document.getElementById('manual-address').value;
    const selectedArea = document.getElementById('booking-area')?.value || detectPuneArea(manualAddress);
    
    // GPS Coordinates (SessionStorage)
    const userLat = sessionStorage.getItem('userLat') || "18.5204"; // Default: Pune Swargate
    const userLon = sessionStorage.getItem('userLon') || "73.8567";

    // Loading State Button UI
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerText = "Booking Upload Hot Ahe...";
    submitBtn.disabled = true;

    try {
        let photoUrl = "";

        // 2. Photo Storage Handling
        if (photoFile) {
            /* 
            // Real Firebase Storage Upload (Modular v9+)
            const storageRef = ref(storage, `problem_photos/${Date.now()}_${photoFile.name}`);
            const uploadTask = await uploadBytes(storageRef, photoFile);
            photoUrl = await getDownloadURL(uploadTask.ref);
            */
            photoUrl = URL.createObjectURL(photoFile); // Temporary Local Blob URL for Testing
        }

        // 3. Construct Booking Data Object
        const bookingData = {
            serviceCategory: serviceType,
            photoUrl: photoUrl,
            offeredPayment: Number(paymentBudget),
            appointmentDate: date,
            appointmentTime: time,
            manualAddress: manualAddress,
            customerArea: selectedArea,
            customerLocation: {
                lat: Number(userLat),
                lon: Number(userLon)
            },
            status: "Pending", // Pending -> Accepted -> Completed
            createdAt: new Date().toISOString()
        };

        // Local Data Backup (For UI Syncing)
        localStorage.setItem('gharatil_seva_latest_booking', JSON.stringify(bookingData));

        /*
        // Real Firestore Save (Modular v9+)
        const docRef = await addDoc(collection(db, "bookings"), bookingData);
        listenForWorkerAcceptance(docRef.id);
        */

        // UI State Update
        document.getElementById('booking-form').classList.add('hidden');
        document.getElementById('status-box').classList.remove('hidden');
        document.getElementById('status-box').classList.add('flex');
        
        // Start Simulated Worker Acceptance Flow
        simulateWorkerAcceptance();

    } catch (error) {
        console.error("Booking submission error: ", error);
        alert("Booking karta yet nahiye. Krupaya punha prayatna kara.");
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
    }
});

// Helper Function: Area Detection Fallback
function detectPuneArea(address) {
    const areas = ['Swargate', 'Katraj', 'Shivajinagar', 'Kothrud', 'Hadapsar', 'Hinjewadi', 'Viman Nagar', 'Baner', 'Wakad'];
    for (let area of areas) {
        if (address.toLowerCase().includes(area.toLowerCase())) {
            return area;
        }
    }
    return 'Swargate';
}

// Simulated Listener Function
function simulateWorkerAcceptance() {
    const statusBox = document.getElementById('status-box');
    
    // Simulate 6-second delay for worker acceptance
    setTimeout(() => {
        statusBox.className = "mt-6 p-6 bg-emerald-950/90 border-2 border-emerald-500 rounded-3xl text-center shadow-2xl flex flex-col items-center gap-3 animate-pulse";
        statusBox.innerHTML = `
            <div class="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mb-1">
                <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
            </div>
            <h3 class="text-lg font-bold text-emerald-300 tracking-wide">Your Appointment is Confirmed!</h3>
            <p class="text-xs text-gray-300 leading-relaxed max-w-sm">
                Worker ne tumchi order accept keli ahe ani te tumchya location kade rewna zale ahet.
            </p>
            <a href="map-view.html" class="mt-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-3 px-6 rounded-xl transition shadow-lg flex items-center gap-2">
                <span>Worker Live Location Bagha (Map)</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                </svg>
            </a>
        `;
    }, 6000);
}
