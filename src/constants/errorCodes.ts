// Error message constants
export const ERRORS = {
    // Auth errors (400xxx)
    USER_EMAIL_EXISTS: { message: 'User with this email already exists', code: 400001 },
    INVALID_CREDENTIALS: { message: 'Invalid credentials', code: 400002 },
    MISSING_PARAMETERS: { message: 'Required parameters are missing', code: 400003 },
    CURRENT_PASSWORD_INCORRECT: { message: 'Current password is incorrect', code: 400004 },

    // Auth errors (401xxx)
    UNAUTHORIZED: { message: 'Unauthorized access', code: 401001 },
    INVALID_TOKEN: { message: 'Invalid or expired token', code: 401002 },

    // Not found errors (404xxx)
    USER_NOT_FOUND: { message: 'User not found', code: 404001 },
    RESOURCE_NOT_FOUND: { message: 'The requested resource was not found', code: 404002 },
    CURRENCY_DATA_NOT_FOUND: { message: 'Currency data not found', code: 404003 },
    PORTFOLIO_NOT_FOUND: { message: 'Portfolio not found', code: 404004 },

    // Server errors (500xxx)
    INTERNAL_SERVER_ERROR: { message: 'Internal server error', code: 500001 },
    EXTERNAL_API_ERROR: { message: 'Error occurred while communicating with external API', code: 500002 },
    DATABASE_ERROR: { message: 'Database operation failed', code: 500003 },
    SERVICE_URL_NOT_CONFIGURED: { message: 'Service URL is not configured', code: 500004 },
    USER_CREATION_FAILED: { message: 'User creation failed', code: 500005 },
    PASSWORD_CHANGE_FAILED: { message: 'Password change failed', code: 500006 },

    //BAD REQUEST
    BAD_REQUEST: { message: 'Bad request', code: 400004 },
    INVALID_ASSET_ID: { message: 'Invalid asset id', code: 400005 },
    PORTFOLIO_CREATION_FAILED: { message: 'Portfolio creation failed', code: 400006 },
    PORTFOLIO_UPDATE_FAILED: { message: 'Portfolio update failed', code: 400007 },
    PORTFOLIO_DELETION_FAILED: { message: 'Portfolio deletion failed', code: 400008 },
    PORTFOLIO_ITEM_DELETION_FAILED: { message: 'Portfolio item deletion failed', code: 400009 },
};  
