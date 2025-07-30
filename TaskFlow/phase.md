# Phase 2 Submission

## Live Public URL

**https://taskflow-webapp-legion-ghahajc0d4a7byaf.ukwest-01.azurewebsites.net/**

## Demo video link
https://youtu.be/ow2mlNZH7EE

---

## Screenshots of Provisioned Resources

[](https://photos.app.goo.gl/vzNpQrvTfyGmSGFC7)

---

## Peer Review

- **Link to Pull Request you reviewed:**
 (https://github.com/cekwedike/campus-connect/pull/38#issuecomment-3116594365) 

---

## Reflection

### What Went Well:
- **Infrastructure as Code**: Terraform configuration worked smoothly for provisioning Azure resources (PostgreSQL, Container Registry, App Service)
- **Docker Multi-stage Builds**: Efficient containerization with optimized image sizes
- **Azure Integration**: Seamless integration between Azure CLI, Container Registry, and App Service

### Challenges Faced:
- **Docker Build Context**: Initial issues with Dockerfile paths requiring updates to reference correct directory structure (backend/ and frontend/)
- **Container Registry Authentication**: Required proper Azure CLI login and ACR authentication
- **Nginx Group Conflict**: Frontend Dockerfile needed adjustment for existing nginx group in base image

### Key Learnings:
- Importance of proper build context and file paths in multi-directory projects
- Value of Infrastructure as Code for reproducible deployments
- Docker multi-stage builds significantly reduce final image size and improve security

---

## **1. Wrong Startup Command or Missing Entrypoint**

Azure expects a Node.js app to have a `server.js` file or a `start` script in `package.json`.  
If you are deploying a Docker image, Azure expects your container to listen on the port it provides (usually 8080, via the `PORT` environment variable).

### **Checklist:**
- **If NOT using Docker:**  
  - Your `package.json` must have:
    ```json
    "scripts": {
      "start": "node server.js"
    }
    ```
  - You must have a `server.js` file at the root of your deployed code.

- **If using Docker:**  
  - Your Dockerfile must have:
    ```dockerfile
    EXPOSE 8080
    CMD ["node", "server.js"]
    ```
  - Your app must listen on `process.env.PORT` (which will be 8080 in Azure).

---

## **2. App Not Listening on the Correct Port**

Azure sets the `PORT` environment variable (usually 8080).  
**Your app must use this port:**
```js
const port = process.env.PORT || 5000;
app.listen(port, () => { ... });
```
If you hardcode a different port, Azure will fail the health check and kill the container.

---

## **3. Missing Dependencies or Build Step**

If you are deploying only source code (not a Docker image), make sure all dependencies are installed and the app is built (for frontend).

---

## **4. Missing Environment Variables**

If your app needs a database connection string, JWT secret, etc., and they are missing, it may crash.

---

## **5. Dockerfile Issues (if using Docker)**

- Make sure your Dockerfile copies all necessary files and runs the correct command.
- Make sure you are not using a multi-stage build that omits the final build output.

---

# **How to Fix (Step-by-Step)**

### **A. Check Your App’s Listening Port**

1. Open your `server.js` (or main entry file).
2. Make sure you have:
   ```js
   const port = process.env.PORT || 8080;
   app.listen(port, () => { ... });
   ```
   - **Do NOT hardcode `3000`, `5000`, etc.** Use `process.env.PORT`.

### **B. Check Your Dockerfile (if using Docker)**

1. Make sure you have:
   ```dockerfile
   EXPOSE 8080
   CMD ["node", "server.js"]
   ```
2. Make sure your app is built and all files are copied in the final image.

### **C. Check package.json (if NOT using Docker)**

1. In your deployed code, make sure you have:
   ```json
   "scripts": {
     "start": "node server.js"
   }
   ```
2. Make sure `server.js` exists at the root.

### **D. Check Environment Variables in Azure**

1. Go to Azure Portal → App Service → Configuration.
2. Make sure all required variables are set (DB connection, JWT secret, etc.).

### **E. Test Locally with Azure’s Settings**

1. Try running your app locally with:
   ```sh
   PORT=8080 node server.js
   ```
   or, for Docker:
   ```sh
   docker run -e PORT=8080 your-image
   ```
   - If it fails locally with this port, it will fail in Azure.

---

## **Summary Table**

| Step | What to Check | How to Fix |
|------|---------------|------------|
| 1    | Listening port | Use `process.env.PORT` in your app |
| 2    | Startup command | `start` script in `package.json` or `CMD` in Dockerfile |
| 3    | Dockerfile | `EXPOSE 8080` and correct `CMD` |
| 4    | Env variables | Set all required in Azure Portal |
| 5    | Local test | Run with `PORT=8080` locally |

---

## **What To Do Next**

1. **Check your app’s listening port and startup command.**
2. **Update your code and redeploy.**
3. **If it still fails, copy the exact error from the Azure Log Stream (look for lines with “Error” or stack traces).**

---

**If you want, paste your `server.js`, `Dockerfile`, and `package.json` here and I’ll review them for you!**  
This will help me give you the exact fix for your deployment.
