// app/api/auth/register/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

import { Role } from '@prisma/client';

const SALT_ROUNDS = 10; 

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password, name, role } = body;

        // 1. Basic Validation
        if (!email || !password) {
            return NextResponse.json({ message: 'Email and password are required.' }, { status: 400 });
        }

        // 2. Check if User Already Exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json({ message: 'User with this email already exists.' }, { status: 409 });
        }
        
        // 3. Hash the Password (CRITICAL SECURITY STEP)
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        
        // 4. Determine User Role
        // Object.values(Role) extracts ['ADMIN', 'EMPLOYEE'] for validation
        const userRole = role && Object.values(Role).includes(role) ? role : Role.EMPLOYEE;

        // 5. Create the New User in the Database
        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name: name || null,
                role: userRole,
            },
            // Select which fields to return (NEVER return the password hash!)
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
            }
        });

        // 6. Success Response
        return NextResponse.json(newUser, { status: 201 });

    } catch (error) {
        console.error('Registration Error:', error);
        return NextResponse.json({ message: 'Internal Server Error during registration.' }, { status: 500 });
    }
}