import { k8sCoreV1Api } from "./config.js";



export async function createPod(sandboxId) {

    const podManifest = {
        metadata: {
            name: `sandbox-pod-${sandboxId}`,
            labels: {
                app: "sandbox-instance",
                id: sandboxId
            }
        },
        spec: {

            volumes: [{
                name: "workspace-volume",
                emptyDir: {}
            }],

            initContainers: [
                {
                    name: "init-container",
                    image: "template:latest",
                    imagePullPolicy: "IfNotPresent",
                    command: ["sh", "-c", "cp -r /workspace/. /seed/"],
                    volumeMounts: [
                        {
                            name: "workspace-volume",
                            mountPath: "/seed"
                        }
                    ]

                }
            ],

            containers: [
                {
                    image: "template:latest",
                    imagePullPolicy: "IfNotPresent",
                    name: "sandbox-container",
                    ports: [{ containerPort: 5173, name: "http" }],
                    readinessProbe: {
                        httpGet: {
                            path: "/",
                            port: 5173
                        },
                        initialDelaySeconds: 5,
                        periodSeconds: 5
                    },
                    resources: {
                        requests: { cpu: "500m", memory: "500Mi" },
                        limits: { cpu: "2", memory: "2Gi" }
                    },
                    volumeMounts: [
                        {
                            name: "workspace-volume",
                            mountPath: "/workspace"
                        }
                    ]
                },
                {
                    image: "agent:latest",
                    imagePullPolicy: "IfNotPresent",
                    name: "agent-container",
                    ports: [{ containerPort: 3000, name: "http" }],
                    readinessProbe: {
                        httpGet: { path: "/", port: 3000 },
                        initialDelaySeconds: 5,
                        periodSeconds: 5
                    },
                    resources: {
                        requests: { cpu: "500m", memory: "500Mi" },
                        limits: { cpu: "1", memory: "1Gi" }
                    },
                    volumeMounts: [
                        {
                            name: "workspace-volume",
                            mountPath: "/workspace"
                        }
                    ]
                }

            ]
        }

    }

    const response = await k8sCoreV1Api.createNamespacedPod({
        namespace: "default",
        body: podManifest
    })

    console.log("Pod created:", response.metadata.name)

    return response

}


export async function deletePod(sandboxId){
    const podName = `sandbox-pod-${sandboxId}`

    const response = await k8sCoreV1Api.deleteNamespacedPod({
        name: podName,
        namespace: "default"
    },{
        gracePeriodSeconds: 0
    }
)

    console.log(`Pod ${podName} deleted`);

    return response
}