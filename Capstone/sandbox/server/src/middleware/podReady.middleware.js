import { k8sCoreV1Api } from "../kubernetes/config.js";

export async function waitForPodReady(sandboxId, timeoutMs = 180000) {
    const podName = `sandbox-pod-${sandboxId}`;
    const start = Date.now();
    
    while (Date.now() - start < timeoutMs) {
        try {
            const pod = await k8sCoreV1Api.readNamespacedPod({
                name: podName,
                namespace: "default"
            });
            
            const containerStatuses = pod.status?.containerStatuses || [];
            const allReady = containerStatuses.length > 0 && 
                             containerStatuses.every(c => c.ready === true);
            
            if (allReady && pod.status?.phase === "Running") {
                console.log(`Pod ${podName} is ready`);
                return true;
            }
        } catch (err) {
        }
        
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    throw new Error(`Pod ${podName} did not become ready within ${timeoutMs}ms`);
}
