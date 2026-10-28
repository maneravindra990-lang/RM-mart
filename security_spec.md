# RM Mart Security Specification

## Data Invariants
1. A product must have a valid price and category.
2. An order must contain at least one item and valid customer contact details.
3. Only the authorized owner can modify products, categories, offers, and settings.
4. Product prices and stock can only be updated by the owner.
5. Customers can track their own orders using Order ID and mobile number.

## The Dirty Dozen Payloads
1. **Identity Spoofing**: Attempt to update a product price as an unauthenticated user.
2. **Identity Spoofing**: Attempt to delete another customer's order.
3. **Identity Spoofing**: Attempt to update order status as a customer.
4. **Identity Spoofing**: Attempt to access the admin settings document as a customer.
5. **State Shortcutting**: Attempt to create an order with `paymentStatus: "PAID"` without actual payment confirmation.
6. **State Shortcutting**: Attempt to set `orderStatus: "DELIVERED"` during creation.
7. **Resource Poisoning**: Attempt to create a product with a 1MB name string.
8. **Resource Poisoning**: Attempt to create a category with a 1MB description.
9. **Orphaned Write**: Attempt to create an order without a corresponding product existence check (optional in rules, but good for integrity).
10. **Shadow Field**: Attempt to add an `isAdmin: true` field to a customer document (if we had one).
11. **PII Leak**: Attempt to list all orders as an unauthenticated user.
12. **Price Manipulation**: Attempt to set a negative price for a product.

## Test Runner
A `firestore.rules.test.ts` will be created to verify these denials.
