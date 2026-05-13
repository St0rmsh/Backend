import * as K8sApi from "@kubernetes/client-node";

const k8sConfig = new K8sApi.KubeConfig();
k8sConfig.loadFromDefault();

export const k8sCoreV1Api = k8sConfig.makeApiClient(K8sApi.CoreV1Api);
