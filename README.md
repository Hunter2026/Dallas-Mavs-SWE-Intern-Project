Installing React:

npm install react react-dom

Installing React Router:

npm install react-router-dom

Installing React Chart:

npm install recharts

Running the program: 

npm run dev

Data Source:

Player data is stored in public/intern_project_data.json and loaded using fetch() in the frontend.

Features:

Big Board along with scout rankings of all prospects in 2025 NBA Draft

User can navigate from Big Board to player cards. The user can access an individual player card by clicking on the player name in the big board. 
Inside the player card, the user can see the cards so far representing available photo,
height, weight, and hometown. Along with this information, the user can see the mavericks scout rankings
and submit scouting reports, with the user being able to see what they typed when they click submit. 

When the user clicks on the player profile, they are able to see the player's true measurements and 
statistics through game logs or in season stats. They are also able to filter which season the player has those game logs 
(there isn't enough game logs for more than one season but it's a nice feature for future purposes) and they have the ability
to sort through stats in the game logs by most to least. 

Since we have career averages, season averages, and game logs, I decided to implement a player development chart over their career
to see increase or decrease in minutes, points, assists, total rebounds, steals and blocks. This way it is easy to see visually on whether
a player's progression as been positive or negative.

Now to focus on the scouting side, I have added a scouting form that which a user can add the player's strengths, weaknesses, 
player comparison, the best NBA fit (team), projected role, projected ceiling, draft range, and a trait rating. This trait rating has
numbers 0-10 based on shooting, ball handling, defense, athleticism, IQ, and motor that the user can select. 

On top of the full submitted report, I have added a generated simple summary to get the main idea of the player in a few sentences, 
making it easy for scouts to process information quickly. These submitted reports will be able to be viewed on a submitted reports page
where scouts can compare reports with one another in the present or future. 

