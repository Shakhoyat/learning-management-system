# Payment Service Documentation

## Overview
The Payment Service handles all financial transactions including session payments, teacher payouts, refunds, and billing management. It integrates with Stripe for secure payment processing.

## Service Details
- **Port**: 3006
- **Base URL**: `http://localhost:3006`
- **API Prefix**: `/api/payments`

## Features
- 💳 Secure payment processing with Stripe
- 💰 Session booking payments
- 🔄 Automated teacher payouts
- 💸 Refund management
- 📊 Financial analytics and reporting
- 🧾 Invoice generation
- 💎 Subscription and pricing plans
- 🔒 PCI compliance

## Payment Flow
1. Student books session → Payment intent created
2. Payment processed → Funds held in escrow
3. Session completed → Teacher payout initiated
4. Platform fee deducted → Final settlement

---

## API Endpoints

### 💳 Payment Processing

#### Create Payment Intent

**POST** `/api/payments/intent`

Create a payment intent for session booking.

##### Request Body
```javascript
{
  "sessionId": "507f1f77bcf86cd799439060",
  "amount": 4950, // Amount in cents (49.50 USD)
  "currency": "usd",
  "paymentMethod": "card", // card, apple_pay, google_pay
  "metadata": {
    "sessionTitle": "React Fundamentals",
    "teacherId": "507f1f77bcf86cd799439020",
    "studentId": "507f1f77bcf86cd799439011"
  }
}
```

##### Response
```javascript
{
  "success": true,
  "data": {
    "paymentIntent": {
      "id": "pi_1234567890",
      "clientSecret": "pi_1234567890_secret_abcdef",
      "amount": 4950,
      "currency": "usd",
      "status": "requires_payment_method",
      "metadata": {
        "sessionId": "507f1f77bcf86cd799439060",
        "type": "session_payment"
      }
    },
    "breakdown": {
      "sessionPrice": 4500, // $45.00
      "platformFee": 450,   // $4.50 (10%)
      "totalAmount": 4950   // $49.50
    }
  }
}
```

#### Confirm Payment

**POST** `/api/payments/confirm`

Confirm and process the payment.

##### Request Body
```javascript
{
  "paymentIntentId": "pi_1234567890",
  "paymentMethodId": "pm_1234567890"
}
```

##### Response
```javascript
{
  "success": true,
  "message": "Payment processed successfully",
  "data": {
    "payment": {
      "id": "507f1f77bcf86cd799439110",
      "stripePaymentIntentId": "pi_1234567890",
      "amount": 4950,
      "currency": "usd",
      "status": "succeeded",
      "sessionId": "507f1f77bcf86cd799439060",
      "paidBy": "507f1f77bcf86cd799439011",
      "paidTo": "507f1f77bcf86cd799439020",
      "platformFee": 450,
      "netAmount": 4050, // Amount after platform fee
      "processedAt": "2025-10-07T00:00:00.000Z"
    },
    "receipt": {
      "receiptNumber": "RCP-2025-001234",
      "receiptUrl": "https://dashboard.stripe.com/receipts/...",
      "downloadUrl": "/api/payments/receipt/507f1f77bcf86cd799439110"
    }
  }
}
```

#### Get Payment Status

**GET** `/api/payments/:paymentId`

Get detailed payment information.

##### Response
```javascript
{
  "success": true,
  "data": {
    "payment": {
      "id": "507f1f77bcf86cd799439110",
      "stripePaymentIntentId": "pi_1234567890",
      "amount": 4950,
      "currency": "usd",
      "status": "succeeded", // requires_payment_method, processing, succeeded, failed
      "session": {
        "id": "507f1f77bcf86cd799439060",
        "title": "React Fundamentals",
        "teacher": {
          "id": "507f1f77bcf86cd799439020",
          "name": "Jane Smith"
        },
        "student": {
          "id": "507f1f77bcf86cd799439011",
          "name": "John Doe"
        }
      },
      "breakdown": {
        "sessionPrice": 4500,
        "platformFee": 450,
        "processingFee": 0,
        "totalAmount": 4950
      },
      "paymentMethod": {
        "type": "card",
        "card": {
          "brand": "visa",
          "last4": "4242",
          "expMonth": 12,
          "expYear": 2025
        }
      },
      "timeline": [
        {
          "status": "created",
          "timestamp": "2025-10-07T00:00:00.000Z"
        },
        {
          "status": "succeeded",
          "timestamp": "2025-10-07T00:01:00.000Z"
        }
      ],
      "createdAt": "2025-10-07T00:00:00.000Z",
      "processedAt": "2025-10-07T00:01:00.000Z"
    }
  }
}
```

---

### 💰 Payouts & Earnings

#### Get Teacher Earnings

**GET** `/api/payments/earnings`

Get earnings summary for teachers.

##### Query Parameters
- `timeframe` (string, default: "30d") - 7d, 30d, 90d, 1y, all
- `status` (string) - Filter by payout status: pending, processing, paid
- `currency` (string, default: "usd") - Currency filter

##### Response
```javascript
{
  "success": true,
  "data": {
    "summary": {
      "totalEarnings": 225000, // $2,250.00 (lifetime)
      "currentBalance": 45000,  // $450.00 (pending payout)
      "paidOut": 180000,       // $1,800.00 (already paid)
      "currency": "usd"
    },
    "recentEarnings": [
      {
        "sessionId": "507f1f77bcf86cd799439060",
        "sessionTitle": "React Fundamentals",
        "student": "John D.",
        "amount": 4050, // $40.50 (after platform fee)
        "earnedAt": "2025-10-07T00:00:00.000Z",
        "payoutStatus": "pending"
      }
    ],
    "payoutSchedule": {
      "frequency": "weekly", // weekly, bi-weekly, monthly
      "nextPayoutDate": "2025-10-14T00:00:00.000Z",
      "minimumThreshold": 5000 // $50.00
    },
    "analytics": {
      "earningsThisMonth": 78000,
      "earningsLastMonth": 92000,
      "averageSessionEarning": 4200,
      "topEarningSkill": {
        "skillName": "JavaScript",
        "earnings": 156000
      }
    }
  }
}
```

#### Request Payout

**POST** `/api/payments/payout`

Request immediate payout (if balance meets minimum threshold).

##### Request Body
```javascript
{
  "amount": 45000, // Amount in cents to withdraw
  "bankAccount": {
    "id": "ba_1234567890", // Saved bank account ID
    "isDefault": true
  }
}
```

##### Response
```javascript
{
  "success": true,
  "message": "Payout requested successfully",
  "data": {
    "payout": {
      "id": "po_1234567890",
      "amount": 45000,
      "currency": "usd",
      "status": "pending", // pending, in_transit, paid, failed
      "expectedArrival": "2025-10-09T00:00:00.000Z",
      "bankAccount": {
        "last4": "6789",
        "bankName": "Chase Bank"
      },
      "requestedAt": "2025-10-07T00:00:00.000Z"
    }
  }
}
```

#### Get Payout History

**GET** `/api/payments/payouts`

Get teacher's payout history.

##### Query Parameters
- `page` (number, default: 1)
- `limit` (number, default: 20)
- `status` (string) - Filter by status

##### Response
```javascript
{
  "success": true,
  "data": {
    "payouts": [
      {
        "id": "po_1234567890",
        "amount": 45000,
        "currency": "usd",
        "status": "paid",
        "bankAccount": {
          "last4": "6789",
          "bankName": "Chase Bank"
        },
        "requestedAt": "2025-10-01T00:00:00.000Z",
        "paidAt": "2025-10-03T00:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalPayouts": 25
    }
  }
}
```

---

### 💸 Refunds

#### Request Refund

**POST** `/api/payments/:paymentId/refund`

Request refund for a session payment.

##### Request Body
```javascript
{
  "reason": "session_cancelled", // session_cancelled, technical_issues, quality_issue, other
  "amount": 4950, // Full or partial refund amount in cents
  "description": "Session was cancelled by teacher due to emergency",
  "sessionCancelled": true
}
```

##### Response
```javascript
{
  "success": true,
  "message": "Refund processed successfully",
  "data": {
    "refund": {
      "id": "re_1234567890",
      "paymentId": "507f1f77bcf86cd799439110",
      "amount": 4950,
      "currency": "usd",
      "reason": "session_cancelled",
      "status": "succeeded", // pending, succeeded, failed
      "processedAt": "2025-10-07T00:00:00.000Z",
      "expectedArrival": "2025-10-12T00:00:00.000Z"
    }
  }
}
```

#### Get Refund Status

**GET** `/api/payments/refunds/:refundId`

Get refund details and status.

##### Response
```javascript
{
  "success": true,
  "data": {
    "refund": {
      "id": "re_1234567890",
      "paymentId": "507f1f77bcf86cd799439110",
      "amount": 4950,
      "currency": "usd",
      "reason": "session_cancelled",
      "status": "succeeded",
      "originalPayment": {
        "sessionTitle": "React Fundamentals",
        "teacher": "Jane Smith",
        "amount": 4950
      },
      "timeline": [
        {
          "status": "requested",
          "timestamp": "2025-10-07T00:00:00.000Z"
        },
        {
          "status": "approved",
          "timestamp": "2025-10-07T00:05:00.000Z"
        },
        {
          "status": "processed",
          "timestamp": "2025-10-07T00:10:00.000Z"
        }
      ],
      "processedAt": "2025-10-07T00:10:00.000Z",
      "expectedArrival": "2025-10-12T00:00:00.000Z"
    }
  }
}
```

---

### 🧾 Invoices & Receipts

#### Get Payment Receipt

**GET** `/api/payments/:paymentId/receipt`

Download payment receipt PDF.

##### Response
- Content-Type: `application/pdf`
- File download with receipt details

#### Generate Invoice

**POST** `/api/payments/invoices`

Generate invoice for teacher earnings.

##### Request Body
```javascript
{
  "period": {
    "startDate": "2025-10-01T00:00:00.000Z",
    "endDate": "2025-10-31T23:59:59.000Z"
  },
  "includeDetails": true // Include session-by-session breakdown
}
```

##### Response
```javascript
{
  "success": true,
  "message": "Invoice generated successfully",
  "data": {
    "invoice": {
      "id": "INV-2025-001234",
      "period": {
        "startDate": "2025-10-01T00:00:00.000Z",
        "endDate": "2025-10-31T23:59:59.000Z"
      },
      "summary": {
        "totalSessions": 15,
        "grossEarnings": 67500, // $675.00
        "platformFees": 6750,   // $67.50
        "netEarnings": 60750    // $607.50
      },
      "sessions": [
        {
          "sessionId": "507f1f77bcf86cd799439060",
          "title": "React Fundamentals",
          "student": "John D.",
          "date": "2025-10-07T14:00:00.000Z",
          "duration": 60,
          "grossAmount": 4500,
          "platformFee": 450,
          "netAmount": 4050
        }
      ],
      "downloadUrl": "/api/payments/invoices/INV-2025-001234/download",
      "generatedAt": "2025-10-31T23:59:59.000Z"
    }
  }
}
```

---

### 💎 Subscriptions & Plans

#### Get Available Plans

**GET** `/api/payments/plans`

Get available subscription plans.

##### Response
```javascript
{
  "success": true,
  "data": {
    "plans": [
      {
        "id": "plan_basic",
        "name": "Basic Plan",
        "description": "Perfect for casual learners",
        "price": 1999, // $19.99/month
        "currency": "usd",
        "interval": "month",
        "features": [
          "Up to 4 sessions per month",
          "Basic chat support",
          "Session recordings (7 days)"
        ],
        "limits": {
          "sessionsPerMonth": 4,
          "recordingRetention": 7
        }
      },
      {
        "id": "plan_premium",
        "name": "Premium Plan",
        "description": "For serious learners",
        "price": 4999, // $49.99/month
        "currency": "usd",
        "interval": "month",
        "features": [
          "Unlimited sessions",
          "Priority support",
          "Session recordings (30 days)",
          "Advanced analytics",
          "Custom learning paths"
        ],
        "limits": {
          "sessionsPerMonth": -1, // Unlimited
          "recordingRetention": 30
        },
        "popular": true
      }
    ]
  }
}
```

#### Subscribe to Plan

**POST** `/api/payments/subscribe`

Subscribe to a pricing plan.

##### Request Body
```javascript
{
  "planId": "plan_premium",
  "paymentMethodId": "pm_1234567890",
  "billingCycle": "monthly", // monthly, yearly
  "promoCode": "WELCOME20" // Optional
}
```

##### Response
```javascript
{
  "success": true,
  "message": "Subscription created successfully",
  "data": {
    "subscription": {
      "id": "sub_1234567890",
      "planId": "plan_premium",
      "status": "active",
      "currentPeriodStart": "2025-10-07T00:00:00.000Z",
      "currentPeriodEnd": "2025-11-07T00:00:00.000Z",
      "nextBillingDate": "2025-11-07T00:00:00.000Z",
      "amount": 4999,
      "currency": "usd",
      "discount": {
        "promoCode": "WELCOME20",
        "percentOff": 20,
        "amountOff": 1000 // $10.00 off
      }
    }
  }
}
```

---

### 📊 Financial Analytics

#### Get Payment Analytics

**GET** `/api/payments/analytics`

Get comprehensive payment analytics.

##### Query Parameters
- `timeframe` (string, default: "30d") - 7d, 30d, 90d, 1y
- `currency` (string, default: "usd")
- `role` (string) - teacher, student, platform

##### Response
```javascript
{
  "success": true,
  "data": {
    "overview": {
      "totalRevenue": 125000,      // $1,250.00
      "totalPayments": 85,
      "averagePayment": 1470,      // $14.70
      "totalRefunds": 5000,        // $50.00
      "refundRate": 0.04           // 4%
    },
    "trends": {
      "dailyRevenue": [
        {"date": "2025-10-01", "revenue": 15000, "payments": 6},
        {"date": "2025-10-02", "revenue": 22000, "payments": 8}
      ],
      "paymentMethods": {
        "card": 0.75,
        "apple_pay": 0.15,
        "google_pay": 0.10
      }
    },
    "teacher": {
      "totalEarnings": 112500,     // Teacher share
      "platformFees": 12500,       // Platform share
      "pendingPayouts": 15000,
      "topEarners": [
        {
          "teacherId": "507f1f77bcf86cd799439020",
          "name": "Jane Smith",
          "earnings": 25000,
          "sessions": 15
        }
      ]
    },
    "student": {
      "totalSpent": 125000,
      "averageSessionCost": 4500,
      "topSpenders": [
        {
          "studentId": "507f1f77bcf86cd799439011",
          "name": "John D.",
          "spent": 18000,
          "sessions": 8
        }
      ]
    }
  }
}
```

---

### 💳 Payment Methods

#### Add Payment Method

**POST** `/api/payments/payment-methods`

Add a new payment method for a user.

##### Request Body
```javascript
{
  "type": "card", // card, bank_account
  "stripePaymentMethodId": "pm_1234567890",
  "isDefault": true
}
```

##### Response
```javascript
{
  "success": true,
  "message": "Payment method added successfully",
  "data": {
    "paymentMethod": {
      "id": "507f1f77bcf86cd799439120",
      "type": "card",
      "stripeId": "pm_1234567890",
      "card": {
        "brand": "visa",
        "last4": "4242",
        "expMonth": 12,
        "expYear": 2025
      },
      "isDefault": true,
      "createdAt": "2025-10-07T00:00:00.000Z"
    }
  }
}
```

#### Get Payment Methods

**GET** `/api/payments/payment-methods`

Get user's saved payment methods.

##### Response
```javascript
{
  "success": true,
  "data": {
    "paymentMethods": [
      {
        "id": "507f1f77bcf86cd799439120",
        "type": "card",
        "card": {
          "brand": "visa",
          "last4": "4242",
          "expMonth": 12,
          "expYear": 2025
        },
        "isDefault": true,
        "createdAt": "2025-10-07T00:00:00.000Z"
      },
      {
        "id": "507f1f77bcf86cd799439121",
        "type": "card",
        "card": {
          "brand": "mastercard",
          "last4": "8888",
          "expMonth": 8,
          "expYear": 2026
        },
        "isDefault": false,
        "createdAt": "2025-09-15T00:00:00.000Z"
      }
    ]
  }
}
```

---

### 🔗 Webhooks

#### Stripe Webhook Handler

**POST** `/api/payments/webhooks/stripe`

Handle Stripe webhook events for payment status updates.

This endpoint processes various Stripe events:
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `charge.dispute.created`
- `transfer.paid`
- `transfer.failed`

---

## Error Responses

### 400 - Bad Request
```javascript
{
  "success": false,
  "message": "Invalid payment amount",
  "code": "INVALID_AMOUNT",
  "details": {
    "minimumAmount": 50, // $0.50
    "maximumAmount": 100000 // $1,000.00
  }
}
```

### 402 - Payment Required
```javascript
{
  "success": false,
  "message": "Payment method declined",
  "code": "CARD_DECLINED",
  "details": {
    "declineCode": "insufficient_funds",
    "suggestedActions": ["Try a different payment method", "Contact your bank"]
  }
}
```

### 409 - Conflict
```javascript
{
  "success": false,
  "message": "Payment already processed",
  "code": "PAYMENT_ALREADY_PROCESSED",
  "data": {
    "existingPaymentId": "507f1f77bcf86cd799439110",
    "status": "succeeded"
  }
}
```

---

## Integration Examples

### Complete Payment Flow
```javascript
// 1. Create payment intent
const intentResponse = await fetch('/api/payments/intent', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    sessionId: 'session123',
    amount: 4950,
    currency: 'usd'
  })
});

const { data: intentData } = await intentResponse.json();

// 2. Collect payment with Stripe Elements
const stripe = Stripe('pk_test_...');
const { clientSecret } = intentData.paymentIntent;

const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
  payment_method: {
    card: cardElement,
    billing_details: {
      name: 'John Doe',
      email: 'john@example.com'
    }
  }
});

// 3. Confirm payment on backend
if (!error && paymentIntent.status === 'succeeded') {
  const confirmResponse = await fetch('/api/payments/confirm', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      paymentIntentId: paymentIntent.id
    })
  });
  
  const { data: paymentData } = await confirmResponse.json();
  console.log('Payment successful:', paymentData);
}
```

### Teacher Payout Request
```javascript
const requestPayout = async (amount) => {
  const response = await fetch('/api/payments/payout', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      amount: amount * 100, // Convert to cents
      bankAccount: { id: 'ba_default', isDefault: true }
    })
  });
  
  const result = await response.json();
  
  if (result.success) {
    console.log(`Payout requested: $${amount}`);
    console.log(`Expected arrival: ${result.data.payout.expectedArrival}`);
  }
};
```

---

## Security & Compliance

### PCI Compliance
- All payment data handled by Stripe
- No sensitive card data stored locally
- PCI DSS Level 1 compliance through Stripe

### Security Measures
- Payment intents for secure payment flow
- Webhook signature verification
- Amount and currency validation
- Duplicate payment prevention
- Fraud detection integration

### Data Protection
- Payment data encrypted in transit and at rest
- Minimal payment data storage
- Regular security audits
- GDPR compliance for EU users

---

This documentation covers the complete Payment Service functionality. For implementation details, refer to `/services/payment-service/` source code.