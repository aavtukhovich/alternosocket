import { StaticImageData } from "next/image";

import Somium from "@/assets/logos/somium.png";
import VRChat from "@/assets/logos/vrchat.png";
import Unreal from "@/assets/logos/unreal.png";
import Unity from "@/assets/logos/unity.png";
import Hyperfy from "@/assets/logos/hyperfy.png";
import Webaverse from "@/assets/logos/webaverse.png";
import Neos from "@/assets/logos/neos.png";
import Viverse from "@/assets/logos/viverse.png";
import Animaze from "@/assets/logos/animaze.png";
import VSeeFace from "@/assets/logos/vseeface.png";
import AnarchyArcade from "@/assets/logos/anarchyarcade.png";
import Monaverse from "@/assets/logos/monaverse.png";
import Emergence from "@/assets/logos/emergence.png";
import VDraw from "@/assets/logos/vdraw.png";
import VMagicMirror from "@/assets/logos/vmagicmirror.png";
import Avatavi from "@/assets/logos/avatari.png";
import Cluster from "@/assets/logos/cluster.png";
import LivTV from "@/assets/logos/livtv.png";
import VirtualCast from "@/assets/logos/virtualcast.png";
import Fortnite from "@/assets/logos/unrealeditor.png";

type Partner = {
    name: string;
    image: StaticImageData;
    link: string;
};

export const PARTNERS: Partner[] = [
    {
        name: "Somnium Space",
        link: "https://somniumspace.com",
        image: Somium,
    },
    {
        name: "VR Chat",
        link: "https://hello.vrchat.com/",
        image: VRChat,
    },
    {
        name: "Unreal Engine 5",
        link: "https://www.unrealengine.com/",
        image: Unreal,
    },
    {
        name: "Unity",
        link: "https://unity.com/",
        image: Unity,
    },
    {
        name: "Hyperfy",
        link: "https://hyperfy.io/",
        image: Hyperfy,
    },
    {
        name: "Webaverse",
        link: "https://webaverse.com/",
        image: Webaverse,
    },
    {
        name: "Neos",
        link: "https://neos.com",
        image: Neos,
    },
    {
        name: "Viverse",
        link: "https://www.viverse.com",
        image: Viverse,
    },
    {
        name: "Animaze",
        link: "https://www.animaze.us",
        image: Animaze,
    },
    {
        name: "VSeeFace",
        link: "https://www.vseeface.icu",
        image: VSeeFace,
    },
    {
        name: "Anarchy Arcade",
        link: "https://www.anarchyarcade.com/blog/welcome/",
        image: AnarchyArcade,
    },
    {
        name: "Monaverse",
        link: "https://monaverse.com",
        image: Monaverse,
    },
    {
        name: "Emergence",
        link: "https://www.emergence.site",
        image: Emergence,
    },
    {
        name: "VDraw",
        link: "https://www.vdraw.com",
        image: VDraw,
    },
    {
        name: "VMagicMirror",
        link: "https://malaybaku.github.io/VMagicMirror/en/",
        image: VMagicMirror,
    },
    {
        name: "Avatavi AR",
        link: "https://avatavi.com/en/index.html",
        image: Avatavi,
    },
    {
        name: "Cluster",
        link: "https://cluster.mu/",
        image: Cluster,
    },
    {
        name: "LivTV",
        link: "https://www.liv.tv/",
        image: LivTV,
    },
    {
        name: "Virtual Cast",
        link: "https://virtualcast.jp/",
        image: VirtualCast,
    },
    {
        name: "Fortnite Editor",
        link: "https://store.epicgames.com/en-US/p/fortnite--uefn",
        image: Fortnite,
    },
];
