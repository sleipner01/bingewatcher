# Client

1. Change the `URI` in `main.ts` to the production URI.
2. Build the project with `bun run build`.
3. Run `bun run preview` to preview the application before deployment.
4. SSH into the VM with `ssh <username>@it2810-16.idi.ntnu.no`. Replace `<username>` with your username.
5. Copy files from the dist folder to the VM with `scp -r dist <username>@it2810-16.idi.ntnu.no:/tmp/`. Replace `<username>` with your username.
6. If there is already a version of the project on the VM, run `sudo rm -r /var/www/html/project2` to remove the old files.
7. Move files from `/tmp/dist` to `/var/www/html` with `sudo mv /tmp/dist/* /var/www/html/project2`.

# Server

1. SSH into the VM with `ssh <username>@it2810-16.idi.ntnu.no`. Replace `<username>` with your username.
2. Copy files from the `server` folder to the VM with `scp -r server <username>@it2810-16.idi.ntnu.no:/tmp/`. Replace `<username>` with your username. Remember to also transfer the `.env` file, or create a new one on the server.
3. If there is already a version of the server on the VM. Stop the old server by finding the id with : `ps -Af | grep bun`. Run `kill -9 pid` to kill the process. Run `sudo rm -r /var/www/server` to remove the old files.
4. Move files from `/tmp/server` to `/var/www/` with `sudo mv /tmp/server/* /var/www/server`.
5. Make sure Bun v1.4+ is installed on the VM
6. Navigate to the server and run `NODE_ENV=production nohup bun src/index.js &` to start the server
   - To start a server at a spesific port, run `PORT=<port> nohup bun src/index.js &`. Replace `<port>` with the port you want to use. <i>Any information you want displayed with the process name can be added before the ampersand.</i>
   - If you do not have .env on the server, or just want to set the URI manually, run `NODE_ENV=manual nohup bun src/index.js <uri> &`. Replace `<uri>` with the URI you want to use. <i>This can be combined with port configuration.</i>
