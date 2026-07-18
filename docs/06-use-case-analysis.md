# TrendAfrica Use Case Analysis
## 1. System Actors

The TrendAfrica MVP has the following primary actors:

### Brand

A business or organization that creates and manages marketing campaigns.

### Creator

An individual who joins campaigns, creates content, and earns rewards.

### Platform Administrator

An authorized user responsible for managing the platform, users, campaigns, and reports.

## 2. Use Case: User Registration

### Use Case ID

UC-001

### Primary Actors

- Brand
- Creator

### Goal

Allow a new user to create a TrendAfrica account.

### Preconditions

- The user has internet access.
- The user is not already logged in.
- The email address is not already registered.

### Main Flow

1. User opens the registration page.
2. User selects an account type (Brand or Creator).
3. User enters the required information.
4. User submits the registration form.
5. The system validates the information.
6. The system creates the account.
7. The system sends a verification email.
8. The user is informed that registration was successful.

### Alternative Flows

- Required information is missing.
- Email address is already registered.
- Password does not meet security requirements.
- Internet connection is lost during registration.

### Postconditions

- A new user account is created.
- The account is pending email verification.

## 3. Use Case: User Login

### Use Case ID

UC-002

### Primary Actors

- Brand
- Creator
- Platform Administrator

### Goal

Allow a registered user to securely access their TrendAfrica account.

### Preconditions

- The user has a registered account.
- The user has verified their email address.
- The user is not currently logged in.

### Main Flow

1. User opens the login page.
2. User enters their email address and password.
3. User submits the login form.
4. The system validates the credentials.
5. The system generates a secure authentication token (JWT).
6. The system redirects the user to the appropriate dashboard based on their role.

### Alternative Flows

- Invalid email or password.
- Email address has not been verified.
- User account has been suspended.
- Internet connection is unavailable.

### Postconditions

- The user is successfully authenticated.
- A secure session is established.
- The user gains access to their dashboard.

## 4. Use Case: User Logout

### Use Case ID

UC-003

### Primary Actors

- Brand
- Creator
- Platform Administrator

### Goal

Allow an authenticated user to securely log out of their TrendAfrica account.

### Preconditions

- The user is logged in.

### Main Flow

1. User clicks the "Logout" button.
2. The system invalidates the current session or authentication token.
3. The system clears any stored authentication data.
4. The system redirects the user to the login or home page.
5. The user is informed that they have successfully logged out.

### Alternative Flows

- The user's session has already expired.
- Network interruption occurs during logout.

### Postconditions

- The user is logged out.
- The session is terminated.
- Protected pages can no longer be accessed without logging in again.

## 5. Use Case: Create Campaign

### Use Case ID

UC-004

### Primary Actor

- Brand

### Goal

Allow a brand to create a new marketing campaign for creators.

### Preconditions

- The brand is logged in.
- The brand profile is complete.
- The brand account is active.

### Main Flow

1. Brand opens the Dashboard.
2. Brand clicks "Create Campaign".
3. Brand enters campaign details.
4. Brand sets campaign budget and reward.
5. Brand selects campaign duration.
6. Brand submits the campaign.
7. The system validates the information.
8. The system saves the campaign.
9. The campaign becomes available for eligible creators.

### Alternative Flows

- Required fields are missing.
- Invalid campaign budget.
- Campaign duration is invalid.
- Internet connection is unavailable.

### Postconditions

- A new campaign is successfully created.
- The campaign is stored in the database.
- Eligible creators can view the campaign.

## 6. Use Case: Browse Campaigns

### Use Case ID

UC-005

### Primary Actor

- Creator

### Goal

Allow creators to discover available marketing campaigns.

### Preconditions

- The creator is logged in.
- The creator profile is complete.

### Main Flow

1. Creator opens the Dashboard.
2. Creator navigates to the Campaigns page.
3. The system displays available campaigns.
4. Creator searches or filters campaigns.
5. Creator selects a campaign.
6. The system displays detailed campaign information.

### Alternative Flows

- No campaigns are available.
- Search returns no results.
- Internet connection is unavailable.

### Postconditions

- The creator views campaign details.
- The creator can decide whether to join the campaign.

## 7. Use Case: Join Campaign

### Use Case ID

UC-006

### Primary Actor

- Creator

### Goal

Allow a creator to join an available marketing campaign.

### Preconditions

- The creator is logged in.
- The creator profile is complete.
- The campaign is active.
- The creator meets the campaign requirements.

### Main Flow

1. Creator opens the campaign details page.
2. Creator reviews the campaign requirements.
3. Creator clicks "Join Campaign".
4. The system validates the creator's eligibility.
5. The system registers the creator as a participant.
6. The system confirms successful campaign enrollment.

### Alternative Flows

- The campaign has reached its participant limit.
- The campaign has expired.
- The creator does not meet the campaign requirements.
- The creator has already joined the campaign.
- Internet connection is unavailable.

### Postconditions

- The creator is enrolled in the campaign.
- The campaign appears in the creator's active campaigns list.
- The creator can submit campaign content.

## 8. Use Case: Submit Campaign Content

### Use Case ID

UC-007

### Primary Actor

- Creator

### Goal

Allow a creator to submit campaign content for review by the brand.

### Preconditions

- The creator is logged in.
- The creator has joined the campaign.
- The campaign is still active.
- The submission deadline has not passed.

### Main Flow

1. Creator opens an active campaign.
2. Creator clicks "Submit Content".
3. Creator uploads the required content (video, image, or document).
4. Creator adds any required notes or links.
5. Creator submits the content.
6. The system validates the submission.
7. The system stores the submission.
8. The brand is notified of the new submission.
9. The creator receives a confirmation message.

### Alternative Flows

- Unsupported file type.
- File exceeds the maximum size.
- Submission deadline has passed.
- Upload fails due to network issues.
- Required information is missing.

### Postconditions

- The submission is stored successfully.
- The submission status is set to "Pending Review".
- The brand can review the submission.

## 9. Use Case: Review Submission

### Use Case ID

UC-008

### Primary Actor

- Brand

### Goal

Allow a brand to review and approve or reject creator submissions.

### Preconditions

- The brand is logged in.
- The brand owns the campaign.
- At least one creator has submitted content.

### Main Flow

1. Brand opens the campaign dashboard.
2. Brand views pending submissions.
3. Brand selects a submission.
4. Brand reviews the submitted content.
5. Brand chooses to approve or reject the submission.
6. If approved, the submission status is updated to "Approved".
7. If rejected, the brand provides a reason for rejection.
8. The creator is notified of the decision.

### Alternative Flows

- Submission cannot be opened.
- Network interruption occurs.
- Brand exits without making a decision.

### Postconditions

- The submission status is updated.
- The creator receives the review result.
- Approved submissions become eligible for reward processing.

## 10. Use Case: Manage Wallet & Earnings

### Use Case ID

UC-009

### Primary Actor

- Creator

### Goal

Allow a creator to view earnings, track transactions, and request withdrawals.

### Preconditions

- The creator is logged in.
- The creator has approved earnings.

### Main Flow

1. Creator opens the Wallet page.
2. The system displays the current wallet balance.
3. The system displays transaction history.
4. Creator selects "Request Withdrawal".
5. Creator enters the withdrawal amount.
6. The system validates the request.
7. The system records the withdrawal request.
8. The creator receives confirmation.

### Alternative Flows

- Insufficient wallet balance.
- Invalid withdrawal amount.
- Network interruption occurs.
- Withdrawal request exceeds platform limits.

### Postconditions

- The withdrawal request is recorded.
- The wallet reflects any pending withdrawal status.
- Administrators can review the withdrawal request.

## 11. Use Case: Manage Users

### Use Case ID

UC-010

### Primary Actor

- Platform Administrator

### Goal

Allow administrators to manage user accounts and maintain platform integrity.

### Preconditions

- The administrator is logged in.
- The administrator has the required permissions.

### Main Flow

1. Administrator opens the Admin Dashboard.
2. Administrator navigates to User Management.
3. The system displays all registered users.
4. Administrator searches or filters users.
5. Administrator selects a user account.
6. Administrator views account details.
7. Administrator performs an action (suspend, reactivate, or update account status).
8. The system saves the changes.
9. The affected user is notified where appropriate.

### Alternative Flows

- User account cannot be found.
- Administrator lacks permission.
- Network interruption occurs.
- Requested action is not permitted.

### Postconditions

- User account information is updated.
- All administrative actions are recorded in the audit log.

## 12. Use Case: Manage Campaigns

### Use Case ID

UC-011

### Primary Actor

- Platform Administrator

### Goal

Allow administrators to monitor and manage campaigns across the platform.

### Preconditions

- The administrator is logged in.
- The administrator has campaign management permissions.

### Main Flow

1. Administrator opens the Admin Dashboard.
2. Administrator navigates to Campaign Management.
3. The system displays all campaigns.
4. Administrator searches or filters campaigns.
5. Administrator selects a campaign.
6. Administrator reviews campaign details.
7. Administrator performs an action (edit, suspend, reactivate, or remove).
8. The system validates the action.
9. The system updates the campaign.
10. The campaign owner is notified if necessary.

### Alternative Flows

- Campaign cannot be found.
- Administrator lacks permission.
- Network interruption occurs.
- The requested action violates platform rules.

### Postconditions

- Campaign information is updated.
- The action is recorded in the audit log.
- Users see the updated campaign status.

## 13. Use Case: Moderate Content

### Use Case ID

UC-012

### Primary Actor

- Platform Administrator

### Goal

Allow administrators to review and moderate reported or inappropriate content.

### Preconditions

- The administrator is logged in.
- The administrator has content moderation permissions.
- At least one content item has been reported or flagged.

### Main Flow

1. Administrator opens the Admin Dashboard.
2. Administrator navigates to Content Moderation.
3. The system displays reported submissions.
4. Administrator selects a reported submission.
5. Administrator reviews the content and report details.
6. Administrator decides to approve, remove, or warn the creator.
7. The system records the moderation decision.
8. The creator is notified if appropriate.

### Alternative Flows

- The reported content no longer exists.
- Administrator lacks permission.
- Network interruption occurs.
- The report is found to be invalid.

### Postconditions

- The moderation decision is saved.
- Report status is updated.
- All moderation actions are recorded in the audit log.

## 14. Use Case: Generate Reports

### Use Case ID

UC-013

### Primary Actor

- Platform Administrator

### Goal

Allow administrators to generate and view reports about platform activities.

### Preconditions

- The administrator is logged in.
- The administrator has reporting permissions.

### Main Flow

1. Administrator opens the Admin Dashboard.
2. Administrator navigates to Reports.
3. Administrator selects a report type.
4. Administrator specifies filters such as date range or campaign.
5. The system generates the requested report.
6. The system displays the report.
7. Administrator may export the report.

### Alternative Flows

- No data matches the selected filters.
- Report generation fails.
- Network interruption occurs.

### Postconditions

- The requested report is generated.
- The administrator can view or export the report.