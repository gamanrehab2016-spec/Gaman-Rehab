console.log('🧪 Testing Backend Service Connection...');

// Test function to manually trigger an appointment booking
async function testAppointmentBooking() {
    console.log('🔄 Starting appointment booking test...');
    
    try {
        // Wait for services to be ready
        console.log('⏳ Waiting for services to initialize...');
        let attempts = 0;
        while (attempts < 100 && (!window.backendService || !window.backendService.isInitialized)) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        
        if (!window.backendService) {
            throw new Error('Backend service not available after waiting');
        }
        
        console.log('✅ Backend service is ready');
        console.log('🔍 Backend service:', window.backendService);
        console.log('🔍 Firebase DB:', window.db);
        console.log('🔍 Firebase global:', window.firebase);
        
        // Test data
        const testAppointment = {
            name: 'Test Patient',
            phone: '9876543210',
            email: 'test@example.com',
            service: 'neuro-rehabilitation',
            appointmentDate: '2025-09-27',
            referredBy: 'Test Hospital',
            doctor: 'Dr. Test',
            additionalNotes: 'Test booking from console',
            formType: 'TEST'
        };
        
        console.log('📝 Submitting test appointment:', testAppointment);
        
        // Book appointment
        const result = await window.backendService.bookAppointment(testAppointment);
        
        console.log('🎉 Appointment booking result:', result);
        
        if (result.success) {
            console.log('✅ SUCCESS: Appointment booked successfully!');
            console.log('🆔 Reference ID:', result.id);
            if (result.firebaseId) {
                console.log('🔥 Firebase ID:', result.firebaseId);
                console.log('📊 Data saved to Firebase database');
            } else {
                console.log('🎭 Mock mode used (Firebase not connected)');
            }
        } else {
            console.error('❌ FAILED: Appointment booking failed');
        }
        
        return result;
        
    } catch (error) {
        console.error('💥 ERROR during appointment booking test:', error);
        return { success: false, error: error.message };
    }
}

// Test function to check Firebase connectivity
async function testFirebaseConnection() {
    console.log('🔥 Testing Firebase connection...');
    
    try {
        if (!window.db) {
            console.log('❌ Firebase database not available');
            return false;
        }
        
        if (!window.firebase) {
            console.log('❌ Firebase services not available');
            return false;
        }
        
        console.log('✅ Firebase database available');
        console.log('✅ Firebase services available');
        
        // Try to access a collection (this will test connectivity)
        const { collection, getDocs } = window.firebase;
        const appointmentsRef = collection(window.db, 'appointments');
        
        console.log('📋 Testing appointments collection access...');
        const snapshot = await getDocs(appointmentsRef);
        
        console.log(`✅ Firebase connection successful! Found ${snapshot.size} existing appointments`);
        
        snapshot.forEach((doc, index) => {
            if (index < 3) { // Show first 3 appointments
                console.log(`📄 Appointment ${index + 1}:`, doc.id, doc.data());
            }
        });
        
        return true;
        
    } catch (error) {
        console.error('💥 Firebase connection test failed:', error);
        return false;
    }
}

// Run tests after page loads
window.addEventListener('load', async () => {
    console.log('🚀 Starting comprehensive backend tests...');
    
    // Wait a bit for Firebase to initialize
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('\n1️⃣ Testing Firebase Connection...');
    const firebaseWorking = await testFirebaseConnection();
    
    console.log('\n2️⃣ Testing Appointment Booking...');
    const bookingResult = await testAppointmentBooking();
    
    console.log('\n📊 TEST SUMMARY:');
    console.log('Firebase Connection:', firebaseWorking ? '✅ WORKING' : '❌ FAILED');
    console.log('Appointment Booking:', bookingResult.success ? '✅ WORKING' : '❌ FAILED');
    
    if (firebaseWorking && bookingResult.success) {
        console.log('🎉 ALL TESTS PASSED! Database integration is working correctly.');
        console.log('💡 You can now book appointments from the main website and they will appear in the admin dashboard.');
    } else {
        console.log('⚠️ Some tests failed. Check the errors above for troubleshooting.');
    }
});

// Make test functions globally available
window.testAppointmentBooking = testAppointmentBooking;
window.testFirebaseConnection = testFirebaseConnection;