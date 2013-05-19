##### README ######

@author Joshua Dickson, Arsani Gaied, Cameron Stoughton
@version May 19, 2013

The nodeflyer application is a web app used to demonstrate the functionality of node.js in a real-time message passing scenario. 

The application operates by passing abstracted messages across a server to mimic the compute power and dynamics of a complicated distributed system.

The nodeflyer takes advantage of this functionality by passing location and behavioral messages back and forth across instances on the server. The nodeflyers themselves then communicate logical decisions. Together, the system illustrates one of node.js's strong points and does so in a practical application.

Because the behavior of the server is abstracted to object-level, it is possible for this implementation to be used in any number of possible ways. The nodeflyer is one representation of those possibilities.