docker build -t mydockerid11235813/complex-client -t mydockerid11235813/complex-client:$SHA -f ./client/Dockerfile ./client
docker build -t mydockerid11235813/complex-server -t mydockerid11235813/complex-server:$SHA -f ./server/Dockerfile ./server
docker build -t mydockerid11235813/complex-worker -t mydockerid11235813/complex-worker:$SHA -f ./worker/Dockerfile ./worker

docker push mydockerid11235813/complex-client
docker push mydockerid11235813/complex-client:$SHA
docker push mydockerid11235813/complex-server
docker push mydockerid11235813/complex-server:$SHA
docker push mydockerid11235813/complex-worker
docker push mydockerid11235813/complex-worker:$SHA

kubectl apply -f k8s/

kubectl set image deployments/client-depl client=mydockerid11235813/complex-client:$SHA
kubectl set image deployments/server-depl server=mydockerid11235813/complex-server:$SHA
kubectl set image deployments/worker-depl worker=mydockerid11235813/complex-worker:$SHA