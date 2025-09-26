/**
 * Admin Dashboard Filters
 * 
 * This script adds search and status filtering to the admin dashboard
 * to allow filtering appointments, visits, callbacks, and consultations.
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('🔍 Initializing admin dashboard filters...');
    
    // Add filter containers to all collection sections
    setupFilterContainers();
    
    // Initialize collection data maps to store original unfiltered data
    window.originalCollectionData = {
        appointments: [],
        visits: [],
        callbacks: [],
        consultations: []
    };
    
    // Function to sync original data from the current variables
    function syncOriginalData() {
        if (window.currentAppointments && window.currentAppointments.length) {
            window.originalCollectionData.appointments = [...window.currentAppointments];
        }
        if (window.currentVisits && window.currentVisits.length) {
            window.originalCollectionData.visits = [...window.currentVisits];
        }
        if (window.currentCallbacks && window.currentCallbacks.length) {
            window.originalCollectionData.callbacks = [...window.currentCallbacks];
        }
        if (window.currentConsultations && window.currentConsultations.length) {
            window.originalCollectionData.consultations = [...window.currentConsultations];
        }
        console.log('🔄 Synced original data:', window.originalCollectionData);
    }
    
    // Sync data initially after a short delay to ensure it's loaded - multiple attempts
    setTimeout(syncOriginalData, 500);
    setTimeout(syncOriginalData, 1000);
    setTimeout(syncOriginalData, 2000);
    setTimeout(syncOriginalData, 5000); // One more attempt after 5 seconds
    
    // Create a global function to force data synchronization
    window.forceFilterDataSync = function() {
        console.log('🔄 Forcing filter data synchronization');
        syncOriginalData();
        return true;
    };
    
    // Override updateCollectionDisplay function which is called by the system
    if (typeof window.updateCollectionDisplay === 'function') {
        console.log('🔄 Overriding updateCollectionDisplay function');
        window.originalUpdateCollectionDisplay = window.updateCollectionDisplay;
        
        window.updateCollectionDisplay = function(collectionName, data) {
            console.log(`🔄 updateCollectionDisplay called for ${collectionName} with ${data?.length || 0} items`);
            
            // Store original data for this collection
            if (data && data.length) {
                window.originalCollectionData[collectionName] = [...data];
                console.log(`📦 Stored ${data.length} original items for ${collectionName}`);
                
                // Also store in the global current variables as backup
                if (collectionName === 'appointments') {
                    window.currentAppointments = data;
                } else if (collectionName === 'visits') {
                    window.currentVisits = data;
                } else if (collectionName === 'callbacks') {
                    window.currentCallbacks = data;
                } else if (collectionName === 'consultations') {
                    window.currentConsultations = data;
                }
            }
            
            // Check if there are active filters
            const searchInput = document.getElementById(`${collectionName}Search`);
            const statusSelect = document.getElementById(`${collectionName}Status`);
            
            const hasActiveFilter = 
                (searchInput && searchInput.value.trim() !== '') || 
                (statusSelect && statusSelect.value !== '');
            
            if (hasActiveFilter && data && data.length) {
                // Apply filters to the original data
                const filteredData = applyFilters(collectionName, data);
                console.log(`🔍 Filtered to ${filteredData.length} items because filters are active`);
                
                // Call the original function with filtered data
                window.originalUpdateCollectionDisplay(collectionName, filteredData);
            } else {
                // No active filters, just pass the data through
                window.originalUpdateCollectionDisplay(collectionName, data || []);
            }
            
            // Apply color coding
            setTimeout(applyStatusColorCoding, 100);
        };
    }
    
    // Override renderCollectionData as well
    if (typeof window.renderCollectionData === 'function') {
        console.log('🔄 Overriding renderCollectionData function');
        window.originalRenderCollectionData = window.renderCollectionData;
        
        window.renderCollectionData = function(collectionName, data, listElement) {
            console.log(`🔄 renderCollectionData called for ${collectionName} with ${data?.length} items`);
            
            // Store original data for this collection if not already stored
            if (data && data.length && (!window.originalCollectionData[collectionName] || window.originalCollectionData[collectionName].length === 0)) {
                window.originalCollectionData[collectionName] = [...data];
                console.log(`📦 Stored ${data.length} original items for ${collectionName} in renderCollectionData`);
            }
            
            // Pass data to original function
            window.originalRenderCollectionData(collectionName, data, listElement);
            
            // Always apply color coding
            setTimeout(applyStatusColorCoding, 100);
        };
    }
    
    // Override renderAppointments function (legacy support)
    if (typeof window.renderAppointments === 'function') {
        console.log('🔄 Overriding renderAppointments function');
        window.originalRenderAppointments = window.renderAppointments;
        
        window.renderAppointments = function(data) {
            console.log(`🔄 renderAppointments called with ${data?.length} items`);
            
            // Store original appointments data if not empty
            if (data && data.length) {
                window.originalCollectionData.appointments = [...data];
                console.log(`📦 Stored ${data.length} original appointment items`);
            }
            
            // Check if there are active filters
            const searchInput = document.getElementById('appointmentsSearch');
            const statusSelect = document.getElementById('appointmentsStatus');
            
            const hasActiveFilter = 
                (searchInput && searchInput.value.trim() !== '') || 
                (statusSelect && statusSelect.value !== '');
            
            if (hasActiveFilter) {
                // Apply filters to the original data
                const filteredData = applyFilters('appointments', data);
                console.log(`🔍 Filtered to ${filteredData.length} appointment items because filters are active`);
                
                // Call the original function with filtered data
                window.originalRenderAppointments(filteredData);
            } else {
                // No active filters, just pass the data through
                window.originalRenderAppointments(data);
            }
            
            // Always apply color coding
            setTimeout(applyStatusColorCoding, 100);
        };
    }
    
    console.log('✅ Admin filters initialized successfully');
});

/**
 * Set up filter containers for all collection sections
 */
function setupFilterContainers() {
    const collectionSections = {
        'appointmentsSection': 'Appointments',
        'visitsSection': 'Visits',
        'callbacksSection': 'Callbacks',
        'consultationsSection': 'Consultations'
    };
    
    // Create filter container for each section
    Object.entries(collectionSections).forEach(([sectionId, displayName]) => {
        const section = document.getElementById(sectionId);
        if (!section) return;
        
        const collectionHeader = section.querySelector('.collection-header');
        if (!collectionHeader) return;
        
        const collectionName = sectionId.replace('Section', '');
        
        // Create filter container
        const filterContainer = createFilterContainer(collectionName);
        
        // Insert after the collection header
        collectionHeader.insertAdjacentElement('afterend', filterContainer);
        
        console.log(`✅ Added filters to ${displayName} section`);
    });
}

/**
 * Create a filter container for a collection
 * 
 * @param {string} collectionName - Name of the collection (appointments, visits, etc.)
 * @returns {HTMLElement} Filter container element
 */
function createFilterContainer(collectionName) {
    const filterContainer = document.createElement('div');
    filterContainer.className = 'filter-container';
    filterContainer.id = `${collectionName}Filters`;
    
    // Search input
    const searchDiv = document.createElement('div');
    searchDiv.className = 'filter-search';
    
    const searchIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    searchIcon.setAttribute('width', '16');
    searchIcon.setAttribute('height', '16');
    searchIcon.setAttribute('viewBox', '0 0 24 24');
    searchIcon.setAttribute('fill', 'none');
    searchIcon.setAttribute('stroke', 'currentColor');
    searchIcon.setAttribute('stroke-width', '2');
    searchIcon.setAttribute('stroke-linecap', 'round');
    searchIcon.setAttribute('stroke-linejoin', 'round');
    
    const searchPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    searchPath.setAttribute('d', 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z');
    searchIcon.appendChild(searchPath);
    
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search...';
    searchInput.id = `${collectionName}Search`;
    searchInput.addEventListener('input', () => handleFilterChange(collectionName));
    
    searchDiv.appendChild(searchIcon);
    searchDiv.appendChild(searchInput);
    
    // Status select
    const statusDiv = document.createElement('div');
    statusDiv.className = 'filter-status';
    
    const statusSelect = document.createElement('select');
    statusSelect.id = `${collectionName}Status`;
    statusSelect.addEventListener('change', () => handleFilterChange(collectionName));
    
    const statusOptions = [
        { value: '', label: 'All Statuses' },
        { value: 'Pending', label: 'Pending' },
        { value: 'Completed', label: 'Completed' },
        { value: 'Cancelled', label: 'Cancelled' },
        { value: 'Rescheduled', label: 'Rescheduled' }
    ];
    
    statusOptions.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.value;
        optionElement.textContent = option.label;
        statusSelect.appendChild(optionElement);
    });
    
    statusDiv.appendChild(statusSelect);
    
    // Reset button
    const resetButton = document.createElement('button');
    resetButton.type = 'button';
    resetButton.className = 'filter-reset';
    resetButton.textContent = 'Reset Filters';
    resetButton.addEventListener('click', () => resetFilters(collectionName));
    
    // Assemble filter container
    filterContainer.appendChild(searchDiv);
    filterContainer.appendChild(statusDiv);
    filterContainer.appendChild(resetButton);
    
    return filterContainer;
}

/**
 * Handle filter changes for a collection
 * 
 * @param {string} collectionName - Name of the collection to filter
 */
function handleFilterChange(collectionName) {
    console.log(`🔍 Filter changed for ${collectionName}`);
    
    // Check filter values
    const searchInput = document.getElementById(`${collectionName}Search`);
    const statusSelect = document.getElementById(`${collectionName}Status`);
    const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const statusFilter = statusSelect ? statusSelect.value : '';
    
    console.log(`🔍 Current filters - Search: "${searchTerm}", Status: "${statusFilter}"`);
    
    // Update UI to show active filters
    updateFilterStatus(collectionName, searchTerm, statusFilter);
    
    // DIRECT ACCESS TO DATA: This is a more reliable way to access the data
    let dataToFilter = [];
    
    // Access the global collection variables directly
    if (collectionName === 'appointments') {
        if (window.currentAppointments && window.currentAppointments.length > 0) {
            dataToFilter = [...window.currentAppointments];
            console.log(`📊 Direct access: Found ${dataToFilter.length} appointments`);
        }
    } else if (collectionName === 'visits') {
        if (window.currentVisits && window.currentVisits.length > 0) {
            dataToFilter = [...window.currentVisits];
            console.log(`📊 Direct access: Found ${dataToFilter.length} visits`);
        }
    } else if (collectionName === 'callbacks') {
        if (window.currentCallbacks && window.currentCallbacks.length > 0) {
            dataToFilter = [...window.currentCallbacks];
            console.log(`📊 Direct access: Found ${dataToFilter.length} callbacks`);
        }
    } else if (collectionName === 'consultations') {
        if (window.currentConsultations && window.currentConsultations.length > 0) {
            dataToFilter = [...window.currentConsultations];
            console.log(`📊 Direct access: Found ${dataToFilter.length} consultations`);
        }
    }
    
    // FALLBACK 1: If direct access failed, try originalCollectionData
    if (dataToFilter.length === 0) {
        if (window.originalCollectionData && window.originalCollectionData[collectionName] && 
            window.originalCollectionData[collectionName].length > 0) {
            dataToFilter = window.originalCollectionData[collectionName];
            console.log(`📊 Fallback 1: Using data from originalCollectionData.${collectionName} (${dataToFilter.length} items)`);
        }
    }
    
    // FALLBACK 2: If still no data, get data from DOM
    if (dataToFilter.length === 0) {
        // Try to extract data from the DOM as a last resort
        const listElement = document.getElementById(`${collectionName}List`);
        if (listElement) {
            const dataCards = listElement.querySelectorAll('.data-card');
            if (dataCards.length > 0) {
                console.log(`📊 Fallback 2: Found ${dataCards.length} data cards in DOM`);
                // We found data cards in the DOM, proceed with filtering without actual data objects
                // Just show all items (bypass the data filtering)
                if (searchTerm || statusFilter) {
                    // Apply visual filtering directly to DOM elements
                    applyVisualFiltering(dataCards, searchTerm, statusFilter);
                    return;
                }
            }
        }
    }
    
    // FALLBACK 3: Create mock data from document tables as absolute last resort
    if (dataToFilter.length === 0) {
        const mockData = extractDataFromDOM(collectionName);
        if (mockData.length > 0) {
            dataToFilter = mockData;
            // Store for future use
            window.originalCollectionData[collectionName] = mockData;
            console.log(`📊 Fallback 3: Created ${mockData.length} mock data items from DOM`);
        }
    }
    
    // If still no data, show error - but make it more user friendly
    if (dataToFilter.length === 0) {
        console.warn('⚠️ Could not find data for filtering');
        
        // Just clear filters without showing an error
        resetFilters(collectionName);
        return;
    }
    
    // Apply filters to the original data
    const filteredData = applyFilters(collectionName, dataToFilter);
    console.log(`🔍 Filtered ${dataToFilter.length} items to ${filteredData.length} items`);
    
    // Render filtered data based on collection
    const listElement = document.getElementById(`${collectionName}List`);
    if (listElement) {
        // Clear current list
        listElement.innerHTML = '';
        
        // Check if there are any results
        if (filteredData.length === 0) {
            console.log('⚠️ No results match the current filters');
            listElement.innerHTML = `
                <div class="empty-state-message" style="text-align: center; padding: 40px 20px;">
                    <p>No results match your filters. Try different search terms or status.</p>
                    <button class="filter-reset" onclick="resetFilters('${collectionName}')">Reset Filters</button>
                </div>
            `;
        } else {
            // Use the appropriate render function
            if (window.originalRenderCollectionData) {
                console.log(`🔄 Using originalRenderCollectionData for ${collectionName} with ${filteredData.length} items`);
                window.originalRenderCollectionData(collectionName, filteredData, listElement);
            } else if (collectionName === 'appointments' && window.originalRenderAppointments) {
                console.log(`🔄 Using originalRenderAppointments for ${filteredData.length} items`);
                window.originalRenderAppointments(filteredData);
            }
            
            // Update filter summary
            const filterSummary = document.getElementById(`${collectionName}FilterSummary`) || 
                                 createFilterSummary(collectionName, listElement);
            
            if (filterSummary) {
                filterSummary.textContent = `Showing ${filteredData.length} of ${dataToFilter.length} items`;
                filterSummary.style.display = 'block';
            }
        }
        
        // Always apply color coding
        setTimeout(applyStatusColorCoding, 100);
    }
}

/**
 * Update the visual status of active filters
 */
function updateFilterStatus(collectionName, searchTerm, statusFilter) {
    const filterContainer = document.getElementById(`${collectionName}Filters`);
    if (!filterContainer) return;
    
    // Remove active class from container
    filterContainer.classList.remove('has-active-filters');
    
    // Update search input styling
    const searchDiv = filterContainer.querySelector('.filter-search');
    if (searchDiv) {
        searchDiv.classList.toggle('active', searchTerm !== '');
    }
    
    // Update status select styling
    const statusDiv = filterContainer.querySelector('.filter-status');
    if (statusDiv) {
        statusDiv.classList.toggle('active', statusFilter !== '');
    }
    
    // Add active class to container if any filter is active
    if (searchTerm || statusFilter) {
        filterContainer.classList.add('has-active-filters');
    }
}

/**
 * Create a filter summary element
 */
function createFilterSummary(collectionName, listElement) {
    // Check if summary already exists
    let summary = document.getElementById(`${collectionName}FilterSummary`);
    
    if (!summary) {
        summary = document.createElement('div');
        summary.id = `${collectionName}FilterSummary`;
        summary.className = 'filter-summary';
        summary.style.padding = '10px 15px';
        summary.style.backgroundColor = '#f8fafc';
        summary.style.borderRadius = '8px';
        summary.style.marginBottom = '15px';
        summary.style.fontSize = '14px';
        summary.style.color = '#64748b';
        summary.style.display = 'none';
        
        // Insert before the list element
        listElement.parentNode.insertBefore(summary, listElement);
    }
    
    return summary;
}

/**
 * Apply visual filtering directly to DOM elements
 * This is used as a fallback when no data objects are available
 */
function applyVisualFiltering(dataCards, searchTerm, statusFilter) {
    console.log(`🔍 Visual filtering: searchTerm="${searchTerm}", statusFilter="${statusFilter}"`);
    let visibleCount = 0;
    
    Array.from(dataCards).forEach(card => {
        let visible = true;
        
        // Apply status filter
        if (statusFilter) {
            const statusBadge = card.querySelector('.status-badge');
            if (statusBadge) {
                const cardStatus = statusBadge.textContent.trim().toLowerCase();
                if (!cardStatus.includes(statusFilter.toLowerCase())) {
                    visible = false;
                }
            }
        }
        
        // Apply search filter
        if (searchTerm && visible) {
            const cardText = card.textContent.toLowerCase();
            if (!cardText.includes(searchTerm)) {
                visible = false;
            }
        }
        
        // Show/hide card
        if (visible) {
            card.style.display = '';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    console.log(`🔍 Visual filtering complete: ${visibleCount} items visible`);
    
    // Update filter summary
    const parentElement = dataCards.length > 0 ? dataCards[0].parentElement : null;
    if (parentElement) {
        const collectionName = parentElement.id.replace('List', '');
        const filterSummary = document.getElementById(`${collectionName}FilterSummary`) || 
                             createFilterSummary(collectionName, parentElement);
        
        if (filterSummary) {
            filterSummary.textContent = `Showing ${visibleCount} of ${dataCards.length} items`;
            filterSummary.style.display = 'block';
        }
    }
    
    // If no results are visible, show a message
    if (visibleCount === 0 && dataCards.length > 0) {
        const parentElement = dataCards[0].parentElement;
        const noResultsDiv = document.createElement('div');
        noResultsDiv.className = 'empty-state-message';
        noResultsDiv.innerHTML = `
            <p>No results match your filters. Try different search terms or status.</p>
            <button class="filter-reset" onclick="resetFilters('${parentElement.id.replace('List', '')}')">Reset Filters</button>
        `;
        parentElement.appendChild(noResultsDiv);
    }
}

/**
 * Extract data from DOM elements as a last resort
 */
function extractDataFromDOM(collectionName) {
    const listElement = document.getElementById(`${collectionName}List`);
    if (!listElement) return [];
    
    const dataCards = listElement.querySelectorAll('.data-card');
    if (dataCards.length === 0) return [];
    
    const extractedData = [];
    
    dataCards.forEach((card, index) => {
        // Extract basic information from the card
        const id = card.getAttribute('data-id') || `dom-generated-${index}`;
        const name = card.querySelector('h4')?.textContent || 'Unknown';
        const statusBadge = card.querySelector('.status-badge');
        const status = statusBadge?.textContent || 'Pending';
        
        // Extract other data points
        const subtitle = card.querySelector('.data-subtitle')?.textContent || '';
        const notes = card.querySelector('.data-notes')?.textContent || '';
        
        // Create a data object
        const dataObj = {
            id,
            name,
            status,
            subtitle,
            notes,
            // Add generic text content for search
            fullText: card.textContent
        };
        
        extractedData.push(dataObj);
    });
    
    console.log(`📊 Extracted ${extractedData.length} data items from DOM for ${collectionName}`);
    return extractedData;
}

/**
 * Apply filters to collection data
 * 
 * @param {string} collectionName - Name of the collection
 * @param {Array} data - Original data array to filter
 * @returns {Array} Filtered data array
 */
function applyFilters(collectionName, data) {
    if (!data || !data.length) return [];
    
    const searchInput = document.getElementById(`${collectionName}Search`);
    const statusSelect = document.getElementById(`${collectionName}Status`);
    
    if (!searchInput || !statusSelect) {
        console.log('❌ Filter elements not found');
        return data;
    }
    
    const searchTerm = searchInput.value.toLowerCase().trim();
    const statusFilter = statusSelect.value;
    
    console.log(`🔍 Applying filters: searchTerm="${searchTerm}", statusFilter="${statusFilter}"`);
    console.log(`🔍 Data before filtering:`, data.slice(0, 2)); // Log first two items
    
    // Return original data if no filters are applied
    if (!searchTerm && !statusFilter) {
        console.log('🔍 No filters applied, returning all data');
        return data;
    }
    
    // Apply filters
    const filteredData = data.filter(item => {
        // Debug item 
        console.log(`🔍 Filtering item:`, item.id, `status:`, item.status || 'Pending');
        
        // Handle status filter
        if (statusFilter) {
            const itemStatus = (item.status || 'Pending').toLowerCase();
            const filterStatus = statusFilter.toLowerCase();
            
            // Check if status matches - use includes to handle partial matches
            // This is more robust against inconsistencies in status values
            if (!itemStatus.includes(filterStatus) && !filterStatus.includes(itemStatus)) {
                console.log(`🔍 Item ${item.id} filtered out - status mismatch: "${itemStatus}" vs "${filterStatus}"`);
                return false;
            }
        }
        
        // Handle search filter
        if (searchTerm) {
            const searchFields = getSearchFields(collectionName, item);
            const matchesSearch = searchFields.some(field => {
                if (field && typeof field === 'string') {
                    const fieldLower = field.toLowerCase();
                    const matches = fieldLower.includes(searchTerm);
                    if (matches) {
                        console.log(`🔍 Item ${item.id} matches search "${searchTerm}" in field: "${field}"`);
                    }
                    return matches;
                }
                return false;
            });
            
            if (!matchesSearch) {
                console.log(`🔍 Item ${item.id} filtered out - no search match for "${searchTerm}"`);
                return false;
            }
        }
        
        // This item passed all filters
        console.log(`✅ Item ${item.id} passed all filters`);
        return true;
    });
    
    console.log(`🔍 Filter results: ${filteredData.length}/${data.length} items match filters`);
    console.log(`🔍 Filtered data:`, filteredData.slice(0, 2)); // Log first two filtered items
    
    return filteredData;
}

/**
 * Get searchable fields based on collection type
 * 
 * @param {string} collectionName - Name of the collection
 * @param {Object} item - Item data
 * @returns {Array} Array of searchable field values
 */
function getSearchFields(collectionName, item) {
    // Enhanced common fields with more robust data extraction
    const commonFields = [
        item.name,
        item.phone,
        item.email,
        item.message,
        item.notes,
        item.address,
        item.location,
        item.hospital,
        item.clinic,
        item.center,
        item.status
    ];
    
    // Include all object values as searchable (to be thorough)
    let additionalFields = [];
    for (const key in item) {
        if (typeof item[key] === 'string') {
            additionalFields.push(item[key]);
        } else if (item[key] && typeof item[key] === 'object') {
            // Handle nested objects by converting to string
            try {
                additionalFields.push(JSON.stringify(item[key]));
            } catch (e) { /* Ignore serialization errors */ }
        }
    }
    
    // Collection-specific fields
    switch (collectionName) {
        case 'appointments':
            return [
                ...commonFields,
                item.treatment,
                item.condition,
                item.preferredTime,
                item.tokenDisplay,
                item.formattedDate,
                item.service,
                item.serviceId,
                item.description,
                item.specialRequest,
                item.preferredDoctor,
                item.department,
                ...additionalFields
            ];
            
        case 'visits':
            return [
                ...commonFields,
                item.purpose,
                item.formattedDate,
                item.preferredTime,
                item.visitType,
                item.department,
                item.reason,
                ...additionalFields
            ];
            
        case 'callbacks':
            return [
                ...commonFields,
                item.reason,
                item.formattedDate,
                item.preferredTime,
                item.urgency,
                item.department,
                ...additionalFields
            ];
            
        case 'consultations':
            return [
                ...commonFields,
                item.specialty,
                item.doctor,
                item.formattedDate,
                item.preferredTime,
                item.department,
                item.reason,
                item.diagnosis,
                ...additionalFields
            ];
            
        default:
            return [...commonFields, ...additionalFields];
    }
}

/**
 * Reset filters for a collection
 * 
 * @param {string} collectionName - Name of the collection
 */
function resetFilters(collectionName) {
    console.log(`🔄 Resetting filters for ${collectionName}`);
    
    // Clear filter inputs
    const searchInput = document.getElementById(`${collectionName}Search`);
    const statusSelect = document.getElementById(`${collectionName}Status`);
    
    if (searchInput) searchInput.value = '';
    if (statusSelect) statusSelect.value = '';
    
    // Reset UI for active filters
    updateFilterStatus(collectionName, '', '');
    
    // Clear any filter summary
    const filterSummary = document.getElementById(`${collectionName}FilterSummary`);
    if (filterSummary) {
        filterSummary.style.display = 'none';
    }
    
    // Get the list element first - this is critical
    const listElement = document.getElementById(`${collectionName}List`);
    if (!listElement) {
        console.error(`❌ Cannot find list element for ${collectionName}`);
        return;
    }
    
    // IMPORTANT: First remove any "no results" message if it exists
    const emptyStateMessage = listElement.querySelector('.empty-state-message');
    if (emptyStateMessage) {
        console.log('🧹 Removing empty state message');
        emptyStateMessage.remove();
    }
    
    // Try different approaches to reset data display
    let dataRestored = false;
    
    // Method 1: Show any hidden cards first (this is the fastest way)
    const existingCards = listElement.querySelectorAll('.data-card');
    if (existingCards.length > 0) {
        console.log(`🔄 Showing all ${existingCards.length} existing cards in DOM`);
        existingCards.forEach(card => {
            card.style.display = '';
        });
        dataRestored = true;
        
        // We're done - no need to reload data or re-render
        setTimeout(applyStatusColorCoding, 100);
        return;
    }
    
    // If no cards exist in DOM, we need to re-render
    console.log('No existing cards found in DOM, need to re-render from data');
    
    // Method 2: Try direct access to current data
    let currentData = null;
    if (collectionName === 'appointments' && window.currentAppointments && window.currentAppointments.length) {
        currentData = window.currentAppointments;
    } else if (collectionName === 'visits' && window.currentVisits && window.currentVisits.length) {
        currentData = window.currentVisits;
    } else if (collectionName === 'callbacks' && window.currentCallbacks && window.currentCallbacks.length) {
        currentData = window.currentCallbacks;
    } else if (collectionName === 'consultations' && window.currentConsultations && window.currentConsultations.length) {
        currentData = window.currentConsultations;
    }
    
    if (currentData && currentData.length > 0) {
        console.log(`🔄 Resetting with current${collectionName.charAt(0).toUpperCase() + collectionName.slice(1)} (${currentData.length} items)`);
        
        // Clear current list to ensure clean render
        listElement.innerHTML = '';
        
        // Store in originalCollectionData for future use
        window.originalCollectionData[collectionName] = [...currentData];
        
        // Use the appropriate render function
        if (window.originalRenderCollectionData) {
            window.originalRenderCollectionData(collectionName, currentData, listElement);
            dataRestored = true;
        } else if (collectionName === 'appointments' && window.originalRenderAppointments) {
            window.originalRenderAppointments(currentData);
            dataRestored = true;
        }
    }
    
    // Method 3: Try originalCollectionData if method 2 failed
    if (!dataRestored) {
        const originalData = window.originalCollectionData[collectionName];
        if (originalData && originalData.length > 0) {
            console.log(`🔄 Resetting with originalCollectionData.${collectionName} (${originalData.length} items)`);
            
            // Clear current list to ensure clean render
            listElement.innerHTML = '';
            
            // Use the appropriate render function
            if (window.originalRenderCollectionData) {
                window.originalRenderCollectionData(collectionName, originalData, listElement);
                dataRestored = true;
            } else if (collectionName === 'appointments' && window.originalRenderAppointments) {
                window.originalRenderAppointments(originalData);
                dataRestored = true;
            }
        }
    }
    
    // Method 4: Last resort - try to force reload the collection
    if (!dataRestored) {
        console.warn(`⚠️ Couldn't reset filters for ${collectionName} using standard methods`);
        
        // Check for collection-specific reload functions
        if (collectionName === 'appointments' && typeof window.loadAppointments === 'function') {
            console.log('🔄 Forcing reload of appointments');
            window.loadAppointments();
            dataRestored = true;
        } else if (collectionName === 'visits' && typeof window.loadVisits === 'function') {
            console.log('🔄 Forcing reload of visits');
            window.loadVisits();
            dataRestored = true;
        } else if (collectionName === 'callbacks' && typeof window.loadCallbacks === 'function') {
            console.log('🔄 Forcing reload of callbacks');
            window.loadCallbacks();
            dataRestored = true;
        } else if (collectionName === 'consultations' && typeof window.loadConsultations === 'function') {
            console.log('🔄 Forcing reload of consultations');
            window.loadConsultations();
            dataRestored = true;
        } else if (typeof window.loadActiveCollection === 'function') {
            console.log('🔄 Trying to reload active collection');
            window.loadActiveCollection();
            dataRestored = true;
        }
    }
    
    // Method 5: If everything else failed, add a temporary message and trigger a reload
    if (!dataRestored) {
        console.error('❌ All reset methods failed, adding reload message');
        listElement.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <p>Loading data, please wait...</p>
            </div>
        `;
        
        // Force page refresh after a delay as absolute last resort
        setTimeout(() => {
            location.reload();
        }, 1500);
    }
    
    // Always apply color coding
    setTimeout(applyStatusColorCoding, 100);
}

/**
 * Apply color-coding to items based on status
 */
function applyStatusColorCoding() {
    console.log('🎨 Applying status color coding to all elements');
    
    // Get all data cards
    const dataCards = document.querySelectorAll('.data-card');
    
    if (dataCards.length === 0) {
        console.log('⚠️ No data cards found for color coding');
    } else {
        console.log(`🎨 Found ${dataCards.length} data cards to color code`);
    }
    
    dataCards.forEach(card => {
        // Find status element
        const statusElement = card.querySelector('.status-badge');
        if (!statusElement) {
            console.log('⚠️ No status badge found for card:', card);
            return;
        }
        
        const status = statusElement.textContent.trim().toLowerCase();
        console.log(`🎨 Card status: ${status}`);
        
        // Remove existing status classes
        card.classList.remove('status-pending', 'status-completed', 'status-cancelled', 'status-rescheduled');
        
        // Add appropriate class based on status
        if (status.includes('pending')) {
            card.classList.add('status-pending');
        } else if (status.includes('completed')) {
            card.classList.add('status-completed');
        } else if (status.includes('cancelled')) {
            card.classList.add('status-cancelled');
        } else if (status.includes('rescheduled')) {
            card.classList.add('status-rescheduled');
        }
    });
}

// Make the status color coding function available globally
window.applyStatusColorCoding = applyStatusColorCoding;

// Function to apply status color coding when items are rendered
if (typeof window.renderCollectionItem === 'function') {
    console.log('🎨 Overriding renderCollectionItem to apply color coding');
    window.originalRenderCollectionItem = window.renderCollectionItem;
    
    window.renderCollectionItem = function() {
        // Call the original function
        const result = window.originalRenderCollectionItem.apply(this, arguments);
        
        // Apply color coding after a short delay to ensure DOM is updated
        setTimeout(applyStatusColorCoding, 50);
        
        return result;
    };
}

// MutationObserver to watch for changes in the DOM and apply color coding
const observer = new MutationObserver((mutations) => {
    // Check if the mutations affected data cards
    const shouldApplyColorCoding = mutations.some(mutation => {
        return mutation.addedNodes.length > 0 || 
               (mutation.target && 
                (mutation.target.classList && mutation.target.classList.contains('data-card') ||
                 mutation.target.querySelector && mutation.target.querySelector('.data-card')));
    });
    
    if (shouldApplyColorCoding) {
        // Apply color coding when DOM changes
        setTimeout(applyStatusColorCoding, 50);
    }
});

// Start observing the document with the configured parameters
observer.observe(document.body, { 
    childList: true, 
    subtree: true,
    attributes: true,
    attributeFilter: ['class', 'style']
});

// Apply color coding on page load
document.addEventListener('DOMContentLoaded', function() {
    // Initial color coding with a delay to ensure DOM is ready
    setTimeout(applyStatusColorCoding, 500);
    setTimeout(applyStatusColorCoding, 1500);
    setTimeout(applyStatusColorCoding, 3000);
    
    // Add emergency fix for filter compatibility
    setTimeout(function() {
        // Check if filter dropdowns are missing their event listeners
        const allStatusDropdowns = document.querySelectorAll('select[id$="Status"]');
        allStatusDropdowns.forEach(dropdown => {
            if (!dropdown._hasFilterListener) {
                console.log('🛠️ Adding missing event listener to status dropdown:', dropdown.id);
                dropdown.addEventListener('change', () => {
                    const collectionName = dropdown.id.replace('Status', '');
                    handleFilterChange(collectionName);
                });
                dropdown._hasFilterListener = true;
            }
        });
        
        // Check if search inputs are missing their event listeners
        const allSearchInputs = document.querySelectorAll('input[id$="Search"]');
        allSearchInputs.forEach(input => {
            if (!input._hasFilterListener) {
                console.log('🛠️ Adding missing event listener to search input:', input.id);
                input.addEventListener('input', () => {
                    const collectionName = input.id.replace('Search', '');
                    handleFilterChange(collectionName);
                });
                input._hasFilterListener = true;
            }
        });
        
        // Force data sync
        window.forceFilterDataSync();
    }, 2000);
    
    // Add diagnostic helper function to global scope
    window.debugFilters = function(collectionName) {
        const originalData = window.originalCollectionData[collectionName] || [];
        const searchInput = document.getElementById(`${collectionName}Search`);
        const statusSelect = document.getElementById(`${collectionName}Status`);
        
        console.log('------ FILTER DEBUG ------');
        console.log(`Collection: ${collectionName}`);
        console.log(`Original data count: ${originalData.length}`);
        console.log(`Search term: "${searchInput?.value || ''}"`);
        console.log(`Status filter: "${statusSelect?.value || ''}"`);
        
        const filteredData = applyFilters(collectionName, originalData);
        console.log(`Filtered data count: ${filteredData.length}`);
        
        if (originalData.length > 0) {
            console.log('First few items statuses:');
            originalData.slice(0, 3).forEach((item, i) => {
                console.log(`  Item ${i+1}: "${item.status || 'Pending'}"`);
            });
        }
        
        console.log('Original collection data object:', window.originalCollectionData);
        
        // Show current variables
        if (window.currentAppointments) console.log('currentAppointments:', window.currentAppointments.length);
        if (window.currentVisits) console.log('currentVisits:', window.currentVisits.length);
        if (window.currentCallbacks) console.log('currentCallbacks:', window.currentCallbacks.length);
        if (window.currentConsultations) console.log('currentConsultations:', window.currentConsultations.length);
        
        console.log('-------------------------');
    };
    
    // Add emergency fix function to force reset all filters
    window.emergencyResetFilters = function() {
        console.log('🚨 Emergency reset of all filters');
        
        // Reset each collection's filters
        ['appointments', 'visits', 'callbacks', 'consultations'].forEach(collection => {
            // Clear inputs
            const searchInput = document.getElementById(`${collection}Search`);
            const statusSelect = document.getElementById(`${collection}Status`);
            
            if (searchInput) searchInput.value = '';
            if (statusSelect) statusSelect.value = '';
            
            // Reset UI
            updateFilterStatus(collection, '', '');
            
            // Show all cards
            const listElement = document.getElementById(`${collection}List`);
            if (listElement) {
                const dataCards = listElement.querySelectorAll('.data-card');
                dataCards.forEach(card => {
                    card.style.display = '';
                });
                
                // Remove any empty state message
                const emptyStateMessage = listElement.querySelector('.empty-state-message');
                if (emptyStateMessage) {
                    emptyStateMessage.remove();
                }
            }
        });
        
        // Apply color coding
        applyStatusColorCoding();
        
        alert('All filters have been reset.');
        return true;
    };
    
    // Force initialization of the originalCollectionData
    const initializeFilters = function() {
        console.log('🔄 Force initializing filters with current data...');
        
        // Sync with current data
        if (window.currentAppointments && window.currentAppointments.length) {
            window.originalCollectionData.appointments = [...window.currentAppointments];
            console.log('✅ Synced appointments data:', window.currentAppointments.length, 'items');
        }
        
        if (window.currentVisits && window.currentVisits.length) {
            window.originalCollectionData.visits = [...window.currentVisits];
            console.log('✅ Synced visits data:', window.currentVisits.length, 'items');
        }
        
        if (window.currentCallbacks && window.currentCallbacks.length) {
            window.originalCollectionData.callbacks = [...window.currentCallbacks];
            console.log('✅ Synced callbacks data:', window.currentCallbacks.length, 'items');
        }
        
        if (window.currentConsultations && window.currentConsultations.length) {
            window.originalCollectionData.consultations = [...window.currentConsultations];
            console.log('✅ Synced consultations data:', window.currentConsultations.length, 'items');
        }
        
        // Add filter change handlers to tab switches
        const tabButtons = document.querySelectorAll('.tab-button');
        tabButtons.forEach(button => {
            // Remove any existing listeners
            button.removeEventListener('click', handleTabClick);
            // Add new listener
            button.addEventListener('click', handleTabClick);
        });
        
        // Apply color coding
        applyStatusColorCoding();
        
        console.log('✅ Filter initialization complete');
    };
    
    // Handle tab click to properly sync filters when switching tabs
    function handleTabClick(e) {
        const tabId = e.currentTarget.getAttribute('data-tab');
        console.log(`🔄 Tab switched to: ${tabId}`);
        
        // Collection name is tab ID without "Tab"
        const collectionName = tabId.replace('Tab', '').toLowerCase();
        
        // Force re-initialization of the collection data after a short delay
        setTimeout(() => {
            console.log(`🔄 Re-initializing filters for ${collectionName} after tab switch`);
            
            // Re-sync collection data
            if (window[`current${collectionName.charAt(0).toUpperCase() + collectionName.slice(1)}`]) {
                window.originalCollectionData[collectionName] = [...window[`current${collectionName.charAt(0).toUpperCase() + collectionName.slice(1)}`]];
                
                // Reapply any active filters for this collection
                const searchInput = document.getElementById(`${collectionName}Search`);
                const statusSelect = document.getElementById(`${collectionName}Status`);
                
                if ((searchInput && searchInput.value) || (statusSelect && statusSelect.value)) {
                    console.log('🔄 Reapplying filters after tab switch');
                    handleFilterChange(collectionName);
                }
            }
            
            // Apply color coding
            setTimeout(applyStatusColorCoding, 100);
        }, 300);
    }
    
    // Run initialization after a delay to ensure data is loaded
    setTimeout(initializeFilters, 1000);
    setTimeout(initializeFilters, 3000);
    
    // Expose initialization function globally
    window.initializeFilters = initializeFilters;
});