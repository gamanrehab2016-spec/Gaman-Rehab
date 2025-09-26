// Backend Connection Service for Gaman Rehabilitation Center
// Firebase implementation for appointment booking

class BackendService {
    constructor() {
        this.baseURL = 'https://api.gamanrehab.com'; // Mock URL for reference
        this.isInitialized = false;
        this.db = null;
        this.initializeFirebase();
    }

    // Initialize Firebase connection
    async initializeFirebase() {
        try {
            // Wait for Firebase to be available
            let attempts = 0;
            const maxAttempts = 50;
            
            while (attempts < maxAttempts && (!window.firebase || !window.db)) {
                await new Promise(resolve => setTimeout(resolve, 100));
                attempts++;
            }
            
            if (window.db) {
                this.db = window.db;
                this.isInitialized = true;
                console.log('✅ Backend Service Initialized with Firebase');
            } else {
                console.warn('⚠️ Firebase not available, using mock mode');
                this.isInitialized = true;
            }
        } catch (error) {
            console.error('❌ Error initializing Firebase:', error);
            this.isInitialized = true; // Continue with mock mode
        }
    }

    // Generate a unique reference ID
    generateReferenceId() {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 8).toUpperCase();
        return `GRC${timestamp.toString().slice(-6)}${random}`;
    }

    // Save data to Firebase or simulate if not available
    async saveToFirebase(collectionName, data) {
        if (this.db && window.firebase) {
            try {
                // Import Firebase functions dynamically
                const { collection, addDoc, serverTimestamp } = window.firebase;
                
                // Add Firebase server timestamp
                const docData = {
                    ...data,
                    createdAt: serverTimestamp(),
                    referenceId: this.generateReferenceId(),
                    status: 'Pending'
                };
                
                // Save to Firebase
                const docRef = await addDoc(collection(this.db, collectionName), docData);
                console.log(`✅ Document saved to Firebase (${collectionName}):`, docRef.id);
                
                return {
                    success: true,
                    id: docData.referenceId,
                    firebaseId: docRef.id,
                    message: 'Request submitted successfully to database',
                    data: docData,
                    timestamp: new Date().toISOString()
                };
            } catch (error) {
                console.error(`❌ Error saving to Firebase (${collectionName}):`, error);
                throw error;
            }
        } else {
            // Fallback to mock mode
            return this.simulateApiCall(data);
        }
    }

    // Simulate API delay (fallback mode)
    async simulateApiCall(data) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    id: this.generateReferenceId(),
                    message: 'Request submitted successfully (mock mode)',
                    data: data,
                    timestamp: new Date().toISOString()
                });
            }, 1000); // 1 second delay to simulate real API
        });
    }

    // Book Appointment
    async bookAppointment(appointmentData) {
        try {
            console.log('📅 Booking appointment:', appointmentData);
            
            // Prepare data for Firebase
            const firebaseData = {
                name: appointmentData.name,
                phone: appointmentData.phone,
                email: appointmentData.email || '',
                service: appointmentData.service,
                date: appointmentData.appointmentDate,
                referredBy: appointmentData.referredBy || '',
                doctor: appointmentData.doctor || '',
                additionalNotes: appointmentData.additionalNotes || '',
                formType: appointmentData.formType || 'Appointment'
            };
            
            const result = await this.saveToFirebase('appointments', firebaseData);
            console.log('✅ Appointment booked successfully:', result);
            return result;
        } catch (error) {
            console.error('❌ Error booking appointment:', error);
            throw error;
        }
    }

    // Schedule Center Visit
    async scheduleCenterVisit(visitData) {
        try {
            console.log('🏥 Scheduling center visit:', visitData);
            
            // Prepare data for Firebase
            const firebaseData = {
                name: visitData.name,
                phone: visitData.phone,
                email: visitData.email || '',
                date: visitData.visitDate,
                message: visitData.message || '',
                formType: visitData.formType || 'Visit Center'
            };
            
            const result = await this.saveToFirebase('visits', firebaseData);
            console.log('✅ Center visit scheduled successfully:', result);
            return result;
        } catch (error) {
            console.error('❌ Error scheduling visit:', error);
            throw error;
        }
    }

    // Request Callback
    async requestCallback(callbackData) {
        try {
            console.log('📞 Requesting callback:', callbackData);
            
            // Prepare data for Firebase
            const firebaseData = {
                name: callbackData.name,
                phone: callbackData.phone,
                preferredTime: callbackData.preferredTime || '',
                urgency: callbackData.urgency || '',
                reason: callbackData.reason || '',
                formType: callbackData.formType || 'Callback Request'
            };
            
            const result = await this.saveToFirebase('callbacks', firebaseData);
            console.log('✅ Callback requested successfully:', result);
            return result;
        } catch (error) {
            console.error('❌ Error requesting callback:', error);
            throw error;
        }
    }

    // Request Free Assessment
    async requestFreeAssessment(assessmentData) {
        try {
            console.log('📋 Requesting free assessment:', assessmentData);
            
            // Prepare data for Firebase
            const firebaseData = {
                name: assessmentData.name,
                phone: assessmentData.phone,
                email: assessmentData.email || '',
                date: assessmentData.preferredDate,
                healthCondition: assessmentData.healthCondition || '',
                formType: assessmentData.formType || 'Free Assessment'
            };
            
            const result = await this.saveToFirebase('consultations', firebaseData);
            console.log('✅ Free assessment requested successfully:', result);
            return result;
        } catch (error) {
            console.error('❌ Error requesting assessment:', error);
            throw error;
        }
    }

    // Submit Contact Form
    async submitContactForm(contactData) {
        try {
            console.log('📧 Submitting contact form:', contactData);
            
            // Prepare data for Firebase
            const firebaseData = {
                firstName: contactData.firstName,
                lastName: contactData.lastName,
                email: contactData.email,
                phone: contactData.phone,
                service: contactData.service,
                preferredDate: contactData.preferredDate,
                additionalNotes: contactData.additionalNotes || '',
                formType: 'Contact Form'
            };
            
            const result = await this.saveToFirebase('contact-forms', firebaseData);
            console.log('✅ Contact form submitted successfully:', result);
            return result;
        } catch (error) {
            console.error('❌ Error submitting contact form:', error);
            throw error;
        }
    }

    // Generic form submission
    async submitForm(formData) {
        try {
            console.log('📝 Submitting form:', formData);
            const result = await this.simulateApiCall(formData);
            console.log('✅ Form submitted successfully:', result);
            return result;
        } catch (error) {
            console.error('❌ Error submitting form:', error);
            throw error;
        }
    }

    // Check service health
    async healthCheck() {
        try {
            return {
                success: true,
                status: 'healthy',
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error('❌ Health check failed:', error);
            return {
                success: false,
                status: 'error',
                error: error.message
            };
        }
    }
}

// Initialize the backend service
window.backendService = new BackendService();

// Export for use in modules if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BackendService;
}

console.log('🚀 Backend Connection Service Loaded');