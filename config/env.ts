import dotenv from 'dotenv';
dotenv.config();

export interface Credentials {
    username: string;
    password: string;
}

export const config = {
    BASE_URL: process.env.BASE_URL || 'https://www.saucedemo.com/',

    CREDENTIALS: {
        standard: {
            username: process.env.STANDARD_USER || 'standard_user',
            password: process.env.STANDARD_PASS || 'secret_sauce'
        },
        lockedOut: {
            username: process.env.LOCKED_OUT_USER || 'locked_out_user',
            password: process.env.STANDARD_PASS || 'secret_sauce'
        },
        problem: {
            username: process.env.PROBLEM_USER || 'problem_user',
            password: process.env.STANDARD_PASS || 'secret_sauce'
        },
        performanceGlitch: {
            username: process.env.PERFORMANCE_GLITCH_USER || 'performance_glitch_user',
            password: process.env.STANDARD_PASS || 'secret_sauce'
        },
        visual: {
            username: process.env.VISUAL_USER || 'visual_user',
            password: process.env.STANDARD_PASS || 'secret_sauce'
        },
        error: {
            username: process.env.ERROR_USER || 'error_user',
            password: process.env.STANDARD_PASS || 'secret_sauce'
        },

        // Negative cases
        invalidUser: {
            username: process.env.INVALID_USER || 'ElPePe',
            password: process.env.STANDARD_PASS || 'secret_sauce'
        },
        invalidPassword: {
            username: process.env.STANDARD_USER || 'standard_user',
            password: process.env.INVALID_PASSWORD || 'QuesoConArroz'
        },
        blankUser: {
            username: process.env.BLANK_USER || '',
            password: process.env.STANDARD_PASS || 'secret_sauce'
        },
        blankPassword: {
            username: process.env.STANDARD_USER || 'standard_user',
            password: process.env.BLANK_PASSWORD || ''
        },
        allBlank: {
            username: process.env.BLANK_USER || '',
            password: process.env.BLANK_PASSWORD || ''
        }
    } as const
} as const;