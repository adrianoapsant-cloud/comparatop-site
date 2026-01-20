/**
 * Smart Alert Email Template
 * 
 * Professional "Technical Report" style email for TCO alerts.
 * Uses React Email for cross-client compatibility.
 */

import {
    Body,
    Button,
    Column,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Img,
    Link,
    Preview,
    Row,
    Section,
    Text,
} from '@react-email/components';
import * as React from 'react';

// ============================================
// TYPES
// ============================================

export interface SmartAlertEmailProps {
    // Recipient
    userName?: string;

    // Product info
    productName: string;
    productSku: string;
    productImage?: string;
    productUrl: string;

    // Alert type
    alertType: 'PRICE' | 'SMART_VALUE';

    // Price data
    previousPrice: number;
    currentPrice: number;
    priceDropPercent: number;

    // TCO data (for SMART_VALUE)
    previousTco?: number;
    currentTco?: number;
    projectedSavings5Years?: number;

    // Meta
    stateCode?: string;
}

// ============================================
// HELPERS
// ============================================

function formatBRL(value: number): string {
    return value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });
}

// ============================================
// STYLES
// ============================================

const main = {
    backgroundColor: '#f8fafc',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
};

const container = {
    margin: '0 auto',
    padding: '40px 20px',
    maxWidth: '600px',
};

const card = {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    padding: '32px',
    marginBottom: '24px',
};

const header = {
    textAlign: 'center' as const,
    marginBottom: '32px',
};

const logo = {
    width: '150px',
    height: 'auto',
    marginBottom: '16px',
};

const badge = {
    backgroundColor: '#22c55e',
    color: '#ffffff',
    padding: '6px 16px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600' as const,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
};

const title = {
    fontSize: '24px',
    fontWeight: '700' as const,
    color: '#0f172a',
    margin: '16px 0 8px',
    lineHeight: '1.3',
};

const subtitle = {
    fontSize: '14px',
    color: '#64748b',
    margin: '0 0 24px',
};

const productSection = {
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '24px',
};

const productNameStyle = {
    fontSize: '18px',
    fontWeight: '600' as const,
    color: '#0f172a',
    margin: '0 0 8px',
};

const productSkuStyle = {
    fontSize: '12px',
    color: '#94a3b8',
    fontFamily: 'monospace',
    margin: '0',
};

const tableHeader = {
    fontSize: '11px',
    color: '#64748b',
    fontWeight: '500' as const,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    padding: '8px 0',
    borderBottom: '1px solid #e2e8f0',
};

const tableValue = {
    fontSize: '20px',
    fontWeight: '700' as const,
    fontFamily: 'ui-monospace, monospace',
    padding: '12px 0',
};

const priceOld = {
    ...tableValue,
    color: '#94a3b8',
    textDecoration: 'line-through',
};

const priceNew = {
    ...tableValue,
    color: '#16a34a',
};

const savingsBox = {
    backgroundColor: '#f0fdf4',
    border: '1px solid #bbf7d0',
    borderRadius: '8px',
    padding: '16px',
    textAlign: 'center' as const,
    marginBottom: '24px',
};

const savingsLabel = {
    fontSize: '12px',
    color: '#166534',
    fontWeight: '500' as const,
    margin: '0 0 4px',
};

const savingsValue = {
    fontSize: '28px',
    fontWeight: '700' as const,
    color: '#16a34a',
    fontFamily: 'ui-monospace, monospace',
    margin: '0',
};

const ctaButton = {
    backgroundColor: '#2563eb',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: '600' as const,
    textAlign: 'center' as const,
    padding: '14px 24px',
    width: '100%',
    display: 'block',
};

const footer = {
    textAlign: 'center' as const,
    padding: '24px 0',
};

const footerText = {
    fontSize: '12px',
    color: '#94a3b8',
    margin: '0 0 8px',
};

const footerLink = {
    color: '#64748b',
    textDecoration: 'underline',
};

// ============================================
// COMPONENT
// ============================================

export function SmartAlertEmail({
    userName,
    productName,
    productSku,
    productUrl,
    alertType,
    previousPrice,
    currentPrice,
    priceDropPercent,
    previousTco,
    currentTco,
    projectedSavings5Years,
    stateCode = 'SP',
}: SmartAlertEmailProps) {
    const isTcoAlert = alertType === 'SMART_VALUE';
    const previewText = isTcoAlert
        ? `TCO do ${productName} caiu ${priceDropPercent}%! Economia projetada: ${formatBRL(projectedSavings5Years || 0)}`
        : `Preço do ${productName} caiu ${priceDropPercent}%! Agora ${formatBRL(currentPrice)}`;

    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Body style={main}>
                <Container style={container}>
                    {/* Main Card */}
                    <Section style={card}>
                        {/* Header */}
                        <Section style={header}>
                            <Text style={badge}>
                                {isTcoAlert ? '💡 Oportunidade TCO' : '💰 Alerta de Preço'}
                            </Text>
                            <Heading style={title}>
                                {isTcoAlert
                                    ? 'Custo-Total Mais Vantajoso Detectado'
                                    : 'Queda de Preço Detectada'}
                            </Heading>
                            <Text style={subtitle}>
                                {userName ? `Olá ${userName}! ` : ''}
                                {isTcoAlert
                                    ? 'A análise de custo-total atingiu seu alvo.'
                                    : 'O preço atingiu seu alvo.'}
                            </Text>
                        </Section>

                        {/* Product Info */}
                        <Section style={productSection}>
                            <Text style={productNameStyle}>{productName}</Text>
                            <Text style={productSkuStyle}>SKU: {productSku}</Text>
                        </Section>

                        {/* Price Comparison Table */}
                        <Section>
                            <Row>
                                <Column style={{ width: '50%', paddingRight: '12px' }}>
                                    <Text style={tableHeader}>
                                        {isTcoAlert ? 'TCO Anterior' : 'Preço Anterior'}
                                    </Text>
                                    <Text style={priceOld}>
                                        {formatBRL(isTcoAlert ? (previousTco || 0) : previousPrice)}
                                    </Text>
                                </Column>
                                <Column style={{ width: '50%', paddingLeft: '12px' }}>
                                    <Text style={tableHeader}>
                                        {isTcoAlert ? 'TCO Atual' : 'Preço Atual'}
                                    </Text>
                                    <Text style={priceNew}>
                                        {formatBRL(isTcoAlert ? (currentTco || 0) : currentPrice)}
                                    </Text>
                                </Column>
                            </Row>
                        </Section>

                        <Hr style={{ borderColor: '#e2e8f0', margin: '24px 0' }} />

                        {/* Savings Highlight */}
                        {isTcoAlert && projectedSavings5Years && (
                            <Section style={savingsBox}>
                                <Text style={savingsLabel}>
                                    Economia Projetada (5 anos, {stateCode})
                                </Text>
                                <Text style={savingsValue}>
                                    {formatBRL(projectedSavings5Years)}
                                </Text>
                            </Section>
                        )}

                        {!isTcoAlert && (
                            <Section style={savingsBox}>
                                <Text style={savingsLabel}>Você Economiza</Text>
                                <Text style={savingsValue}>
                                    {formatBRL(previousPrice - currentPrice)}
                                </Text>
                            </Section>
                        )}

                        {/* CTA Button */}
                        <Button href={productUrl} style={ctaButton}>
                            Ver Análise Completa →
                        </Button>
                    </Section>

                    {/* Footer */}
                    <Section style={footer}>
                        <Text style={footerText}>
                            Você recebeu este email porque se inscreveu em alertas no ComparaTop.
                        </Text>
                        <Text style={footerText}>
                            <Link href="https://comparatop.com.br" style={footerLink}>
                                comparatop.com.br
                            </Link>
                            {' • '}
                            <Link href="#" style={footerLink}>
                                Cancelar inscrição
                            </Link>
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
}

export default SmartAlertEmail;
