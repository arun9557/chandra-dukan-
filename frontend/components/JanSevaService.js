// Jan Seva Service Component - Reusable component for Jan Seva services
// This file provides utility functions for Jan Seva module

const JanSevaService = {
    // Format application number
    formatAppNumber(number) {
        return number.toUpperCase();
    },
    
    // Get status badge color
    getStatusColor(status) {
        const colors = {
            'pending': '#f59e0b',
            'under_review': '#3b82f6',
            'approved': '#10b981',
            'rejected': '#ef4444',
            'completed': '#22c55e'
        };
        return colors[status] || '#6b7280';
    },
    
    // Format date
    formatDate(date) {
        return new Date(date).toLocaleDateString('en-IN');
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = JanSevaService;
}
