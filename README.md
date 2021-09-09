# Account Ledger Screen
* Add/Remove Payment Methods
* Add/Remove Account Invoicing Records

# What this exhibition showcases?
* Multi-component nesting
* Dependency Inversion, as DB is not set, utilizing local storage as the data persistence warehouse
* Some small CSS work. These were left as sheets on purpose utilizing a helper component for cleaner injection into
  the app.

# What this is exhibition doesn't show?
* Vuex, this was on purpose as I prefer to keep showcase minimal in features shown in different environments
* NPM, I prefer to keep environment needs minimal for showcases to avoid dependency conflicts

# Why do I elect scoped feature and environment setup?
Showcases are a way to show solutions to particular common situations in an app for my purposes.
Taking every feature I utilize and creating one monolithic showcase leaves too much for the reviewer, and for myself,
to review and explain. For this reason I curate my showcases into projects with tags attached.

# I've seen this work on Codepen, tehPlayground, SassMeister, various fiddles, etc. How come?
Over the years I've done showcases across a plethora of platforms. I've recently elected to bring all of those works
to Github to centralize my showcases. In real world settings I do crib snippets from code or obtain packages but
only if I understand the person's code. In showcases I do all code by hand which is while you'll see minimum package
dependency on code showcases.

Application tooling showcases utilize a lot more package dependency to create scaffolds for various needs on a
system for quickly starting projects and bringing usable tooling to the FE, BE and QA requirements of a system.

# I looked at your css, why aren't you using Flex? Where's SASS/LESS/Bulma/Tailwind?
I'd answer with another question. Why aren't you using Grid and/or why isn't float utilized for small work. I have work
where all the above are used and sometimes only 1 of the above. Sometimes 2 out of 3 for a CSS concern. If this repo
doesn't have a specific feature looking to be used I'm sure within my projects there is at minimum 1 project which
does utilize the features requested. My goals with showcases are to show the breadth of knowledge usages I have
acquired over the years and the experience that came with that knowledge to develop applications with a multitude
of solutions. To show I can do legacy work, I can work across multiple languages and use a multitude of strategies and
tools along with working on cutting edge work.

# Why Don't I see a lot of Docker in your showcases?
Github is not ideal for Docker showcases. In addition I always look at tools for their need and is that need a benefit
to the stability and velocity of a project. I've been around for a while, before VMWare and Vagrant were ever
concepts to developing, heck before jQuery and MooTools were around for that matter. In those years I've seen benefits to the
usage and also slowdown to work. This is why I also spent a lot of time in BASH and understanding how to access OS
information in order to standardize a local user's environment.

On smaller teams it's a lot quicker to set up environment standardization tools than the overhead that
Docker/Vagrant/etc. can introduce. It doesn't mean I don't use Docker or other various DevOps tools. It means I
attempt to choose the path of least resistance in order to accomplish work.
