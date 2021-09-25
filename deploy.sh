#!/bin/bash

#echo "fazendo upload do backend moveltrack2..."
#sshpass -p "30029saj"  scp -r  build/libs/backend-0.0.1-SNAPSHOT.jar root@142.93.180.118:/usr/share/moveltrack2/backend/backend-0.0.1-SNAPSHOT.jar
#echo "upload do cartao-programa finalizado!"

#!/bin/bash
REGISTRY=fb040974
IMAGE=premise-backend
VERSION=1.0.2
echo "docker build . -t $REGISTRY/$IMAGE:$VERSION"
docker build . -t $REGISTRY/$IMAGE:$VERSION
echo "docker push $REGISTRY/$IMAGE:$VERSION"
docker push $REGISTRY/$IMAGE:$VERSION

echo "kubectl apply -f deployment.yml"
kubectl apply -f deployment.yml
echo "kubectl delete pods -l name=premise-backend"
kubectl delete pods -l name=premise-backend
echo "kubectl delete hpa premise-backend"
kubectl delete hpa premise-backend
echo "kubectl autoscale -f deployment.yml  --min=1  --max=5 --cpu-percent=80"
kubectl autoscale -f deployment.yml  --min=1  --max=5 --cpu-percent=80

echo "New version deployed!!!!"
