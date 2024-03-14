"use client";
import "@/styles/NFTCard.css";
import "@/styles/NFTDisplay.css";
import "@/styles/Account.css";
import "@/styles/Tabs.css";

import { useState, useEffect, useContext, Suspense } from "react";
import Loading from "../components/Loading";
import SystemContext from "../context/SystemContext";
import IconButton from "../components/IconButton";
import WalletIcon from "@/assets/icons/wallet-solid.svg";
import { useRouter } from "next/navigation";

import { ACCOUNT_HEADING, ACCOUNT_DESCRIPTION } from "@/data/Texts";

import OwnedDisplay from "../components/account/OwnedDisplay";
import CreatedDisplay from "../components/account/CreatedDisplay";
import Settings from "../components/account/Settings";
import PartnerCollection from "../components/account/PartnerCollection";
import DexArtUserDisplay from "../components/account/DexArtUserDisplay";

import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

import ProfileDisplay from "../components/account/ProfileDisplay";
import Referrals from "../components/account/Referrals";

import TabFinder from "../components/finders/TabFinder";

const AccountPage = () => {
    const router = useRouter();

    const [selectedTab, setSelectedTab] = useState("collected");
    const {
        loggedIn,
        loading,
        user,
        refBalance,
        getReferralBalance,
        ownedNFTs,
        getOwnedItems,
        createdNFTs,
        getCreatedItems,
        handleRefClaim,
        handleLogin,
        handleLogout,
        dexartNFTs,
        getDexartItems,
    } = useContext(SystemContext);

    useEffect(() => {
        if (user) {
            getCreatedItems();
            getDexartItems();
            getReferralBalance();
            getOwnedItems();
        }
    }, [user]);

    function handleTabSwitch(tab: string | null) {
        if (tab) {
            setSelectedTab(tab);
            router.push(`/account?tab=${tab}`);
        } else {
            setSelectedTab("collected");
            router.push(`/account`);
        }
    }

    if (!user || !loggedIn) {
        return (
            <section className="section-account">
                <div className="account-container">
                    <h3>{ACCOUNT_HEADING}</h3>
                    <p className="desc">{ACCOUNT_DESCRIPTION}</p>
                    <div className="account-content">
                        {loading ? (
                            <Loading />
                        ) : (
                            <IconButton icon={<WalletIcon />} addClass="btn-grad" customClickEvent={handleLogin} text="Connect Wallet" />
                        )}
                    </div>
                </div>
            </section>
        );
    } else {
        return (
            <section className="section-account">
                <Suspense fallback={null}>
                    <TabFinder onTabChange={handleTabSwitch} />
                </Suspense>
                <ProfileDisplay user={user} logout={handleLogout} />
                <div className="profile-content">
                    <Tabs id="account-tabs" activeKey={selectedTab} onSelect={(k) => handleTabSwitch(k)} className="mb-3">
                        <Tab eventKey="collected" title="Collected">
                            <OwnedDisplay nfts={ownedNFTs} />
                        </Tab>
                        <Tab eventKey="created" title={user.isPartner ? "Partner Collection" : "Created"}>
                            {user.isPartner ? (
                                <PartnerCollection user={user} collection={user.partnerCollection} nfts={createdNFTs} />
                            ) : (
                                <CreatedDisplay user={user} nfts={createdNFTs} />
                            )}
                        </Tab>
                        <Tab eventKey="dexart" title="DexArt NFTs">
                            <DexArtUserDisplay nfts={dexartNFTs} />
                        </Tab>
                        <Tab eventKey="settings" title="Settings">
                            <Settings user={user} />
                        </Tab>
                        <Tab eventKey="referrals" title="Referrals">
                            <Referrals user={user} balance={refBalance} claim={handleRefClaim} getBalance={getReferralBalance} />
                        </Tab>
                    </Tabs>
                </div>
            </section>
        );
    }
};

export default AccountPage;
