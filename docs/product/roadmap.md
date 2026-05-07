# Roadmap

## 1. Epic: enable more users
- **a.** Implement Supabase  
- **b.** Set up Dani  

## 2. Enable different users from different countries
- **a.** Set up database structure that allows for Maverick users from different countries. The requirements for country profile will be different per country.

## 3. Amend messages
- **a.** Always add a static line at the end of message, confirming your profile.  
- **b.** Always add a dyanmic line at the end of message, confirming your profile.  

## 4. Create tax-query-agent
- **a.** Define PRD
- **b.** Build test cases md. Eg define scenarios in which agent should ask for more info and scenarios in which agent can provide directional guidance.
- **c.** Build it
  

## 5. Set up orchestration agent
- **a.** Identify if question needs more info that profile does not have yet
- **b.** If info not present, ask the user to provide this. Adjust profile and submit question with full context

## 4. Need to decide how to approach ambiguous tax questions
Eg I asked when do i have to pay taxes --> it said June 30
Second question i asked: When is my next tax date --> It said November (filing) 
But i was confused. 
Maybe add some form of harness
